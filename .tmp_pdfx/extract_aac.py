# Extract AAC audio from broken fragmented MP4 (NHK lesson files 01-14)
# The moov is malformed so ffmpeg refuses; samples live in moof/trun boxes.
# These files use nonstandard trun flags; detect size column empirically by
# matching column sum against the following mdat payload size.
import struct
import sys
import os


def adts_header(payload_len, profile=1, sf_idx=7, chan=2):
    # sf_idx=7 -> 22050 Hz (matches the mp3 siblings of this NHK series)
    L = 7 + payload_len
    return bytes([
        0xFF, 0xF1,
        ((profile & 3) << 6) | ((sf_idx & 0xF) << 2) | ((chan >> 2) & 1),
        ((chan & 3) << 6) | ((L >> 11) & 3),
        (L >> 3) & 0xFF,
        ((L & 7) << 5) | 0x1F,
        0xFC,
    ])


def walk_children(data, start, end):
    i = start
    while i + 8 <= end:
        size, typ = struct.unpack('>I4s', data[i:i + 8])
        if size == 1:
            size = struct.unpack('>Q', data[i + 8:i + 16])[0]
        if size < 8:
            break
        yield typ, i, size
        i += size


def top_level_boxes(data):
    """Robustly enumerate top-level boxes; files have broken atoms so fall
    back to scanning for moof/mdat markers sequentially."""
    boxes = []
    pos = 0
    n = len(data)
    while pos + 8 <= n:
        size, typ = struct.unpack('>I4s', data[pos:pos + 8])
        if size == 1:
            size = struct.unpack('>Q', data[pos + 8:pos + 16])[0]
        if size < 8 or pos + size > n:
            # resync: scan forward for next 'moof' or 'mdat'
            nxt = n
            for marker in (b'moof', b'mdat'):
                j = data.find(marker, pos + 1)
                if 0 < j < nxt:
                    nxt = j - 4
            if nxt >= n:
                break
            pos = nxt
            continue
        boxes.append((typ, pos, size))
        pos += size
    return boxes


def extract(path, out_path):
    data = open(path, 'rb').read()
    boxes = top_level_boxes(data)
    frames = []
    for idx, (typ, off, size) in enumerate(boxes):
        if typ != b'moof':
            continue
        # find mdat payload that follows this moof
        mdat_payload = None
        mdat_start = None
        for t2, o2, s2 in boxes[idx + 1:idx + 3]:
            if t2 == b'mdat':
                mdat_start = o2 + 8
                mdat_payload = s2 - 8
                break
        trun = None
        for t3, o3, s3 in walk_children(data, off + 8, off + size):
            if t3 == b'traf':
                for t4, o4, s4 in walk_children(data, o3 + 8, o3 + s3):
                    if t4 == b'trun':
                        trun = (o4, s4)
        if trun is None or mdat_payload is None:
            continue
        k, sz = trun
        cnt = struct.unpack('>I', data[k + 12:k + 16])[0]
        n_words = (sz - 16) // 4  # words after sample_count
        if cnt == 0:
            continue
        # detect optional leading data_offset word and fields-per-sample
        per = skip = None
        for sk in range(3):
            rem = n_words - sk
            if rem > 0 and rem % cnt == 0:
                per, skip = rem // cnt, sk
                break
        if per is None:
            continue
        p = k + 16 + skip * 4
        words = struct.unpack(f'>{rem}I', data[p:p + rem * 4])
        # choose column whose sum matches mdat payload
        best = None
        for col in range(per):
            s = sum(words[col::per])
            if abs(s - mdat_payload) <= 64:
                best = col
                break
        if best is None:
            # try all columns, pick closest
            cand = [(abs(sum(words[c::per]) - mdat_payload), c) for c in range(per)]
            cand.sort()
            if cand and cand[0][0] < mdat_payload * 0.01:
                best = cand[0][1]
            else:
                print(f'  warn: no column matches mdat {mdat_payload}, sums={[sum(words[c::per]) for c in range(per)]}')
                continue
        sizes = words[best::per]
        pos = mdat_start
        for s in sizes:
            frames.append(data[pos:pos + s])
            pos += s

    with open(out_path, 'wb') as f:
        for fr in frames:
            f.write(adts_header(len(fr)))
            f.write(fr)
    return len(frames)


if __name__ == '__main__':
    src_dir = sys.argv[1]
    dst_dir = sys.argv[2]
    os.makedirs(dst_dir, exist_ok=True)
    for i in range(1, 15):
        name = f'{i:02d}-en-le_01.mp4'
        src = os.path.join(src_dir, name)
        dst = os.path.join(dst_dir, f'{i:02d}.aac')
        try:
            n = extract(src, dst)
            print(name, '->', n, 'frames')
        except Exception as e:
            print(name, 'FAILED:', e)
