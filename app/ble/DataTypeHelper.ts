export function getShort(data: Uint8Array, index: number) {
    // Little-endian ordering
    return (data[index + 1] << 8) + data[index];
}

export function getSfloat16(data: Uint8Array, index: number) {
    // Little-endian ordering
    const b0 = data[index];
    const b1 = data[index + 1];

    const mantissa = unsignedToSigned(
        unsignedByteToInt(b0) + ((unsignedByteToInt(b1) & 0x0f) << 8),
        12,
    );
    const exponent = unsignedToSigned(unsignedByteToInt(b1) >> 4, 4);
    return mantissa * Math.pow(10, exponent);
}

function unsignedByteToInt(b: number) {
    return b & 0xff;
}

function unsignedBytesToInt(b: number, c: number) {
    return ((unsignedByteToInt(c) << 8) + unsignedByteToInt(b)) & 0xffff;
}

function unsignedToSigned(unsigned: number, size: number) {
    if ((unsigned & (1 << (size - 1))) != 0) {
        unsigned = -1 * ((1 << (size - 1)) - (unsigned & ((1 << (size - 1)) - 1)));
    }
    return unsigned;
}