import { getShort, getSfloat16 } from './DataTypeHelper';

type GlucoseReading = {
    sequence: number;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    offset?: number;
    mgdl: number;
    sampleType?: number;
    sampleLocation?: number;
    status?: number;
    time: string;
};

export const parseGlucoseReading = (packet: Uint8Array): GlucoseReading | null => {
    // Optional: Uncomment to ensure minimum packet length
    /*
    if (packet.length < 14) {
      return null;
    }
    */

    const flags = packet[0];
    const timeOffsetPresent = (flags & 0x01) > 0;
    const typeAndLocationPresent = (flags & 0x02) > 0;
    const concentrationUnitKgL = (flags & 0x04) === 0;
    const sensorStatusAnnunciationPresent = (flags & 0x08) > 0;

    const sequence = getShort(packet, 1);
    const year = getShort(packet, 3);
    const month = packet[5];
    const day = packet[6];
    const hour = packet[7];
    const minute = packet[8];
    const second = packet[9];

    let index = 10;
    let offset: number | undefined;
    if (timeOffsetPresent) {
        offset = getShort(packet, index);
        index += 2;
    }

    let mgdl: number;
    if (concentrationUnitKgL) {
        const kgl = getSfloat16(packet, index);
        mgdl = kgl * 100000;
    } else {
        const mol = getSfloat16(packet, index);
        const MMOLL_TO_MGDL = 18.0182;
        mgdl = mol * 1000 * MMOLL_TO_MGDL;
    }

    // Apply JavaScript precision fix
    mgdl = parseFloat(mgdl.toFixed(5));

    index += 2;

    let sampleType: number | undefined;
    let sampleLocation: number | undefined;
    if (typeAndLocationPresent) {
        const typeAndLocation = packet[index];
        sampleLocation = (typeAndLocation & 0xf0) >> 4;
        sampleType = typeAndLocation & 0x0f;
        index++;
    }

    let status: number | undefined;
    if (sensorStatusAnnunciationPresent) {
        status = packet[index];
    }

    // Construct the timestamp
    const date = new Date(year, month - 1, day, hour, minute, second);
    const time = date.toLocaleString('de-DE', { timeZone: 'UTC' });

    console.log(`Glucose data: mg/dl: ${mgdl < 0 ? '-INFINITY' : mgdl}  seq: ${sequence
        }  time: ${time}`)

    return {
        sequence,
        year,
        month,
        day,
        hour,
        minute,
        second,
        offset,
        mgdl,
        sampleType,
        sampleLocation,
        status,
        time,
    };
};
