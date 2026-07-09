import fs from 'fs';

import Environment from '#/util/Environment.ts';
import { printFatalError, printWarning } from '#/util/Logger.ts';
import Packet from '#/io/Packet.ts';
import OpenRs2 from '#/util/OpenRs2.ts';


function readLand(data: Packet) {
    const heightmap: number[][][] = [];
    const overlayIds: number[][][] = [];
    const overlayShape: number[][][] = [];
    const overlayRotation: number[][][] = [];
    const flags: number[][][] = [];
    const underlay: number[][][] = [];

    for (let level = 0; level < 4; level++) {
        heightmap[level] = [];
        overlayIds[level] = [];
        overlayShape[level] = [];
        overlayRotation[level] = [];
        flags[level] = [];
        underlay[level] = [];

        for (let x = 0; x < 64; x++) {
            heightmap[level][x] = [];
            overlayIds[level][x] = [];
            overlayShape[level][x] = [];
            overlayRotation[level][x] = [];
            flags[level][x] = [];
            underlay[level][x] = [];

            for (let z = 0; z < 64; z++) {
                heightmap[level][x][z] = -1;
                overlayIds[level][x][z] = -1;
                overlayShape[level][x][z] = -1;
                overlayRotation[level][x][z] = -1;
                flags[level][x][z] = -1;
                underlay[level][x][z] = -1;

                while (true) {
                    const code = data.g1();
                    if (code === 0) {
                        break;
                    }

                    if (code === 1) {
                        heightmap[level][x][z] = data.g1();
                        break;
                    }

                    if (code <= 49) {
                        overlayIds[level][x][z] = data.g1b();
                        overlayShape[level][x][z] = Math.trunc((code - 2) / 4);
                        overlayRotation[level][x][z] = (code - 2) & 3;
                    } else if (code <= 81) {
                        flags[level][x][z] = code - 49;
                    } else {
                        underlay[level][x][z] = code - 81;
                    }
                }
            }
        }
    }

    return {
        heightmap,
        overlayIds,
        overlayShape,
        overlayRotation,
        flags,
        underlay
    };
}

type Loc = {
    id: number;
    shape: number;
    angle: number;
};

function readLocs(data: Packet) {
    const locs: Loc[][][][] = [];

    for (let level = 0; level < 4; level++) {
        locs[level] = [];

        for (let x = 0; x < 64; x++) {
            locs[level][x] = [];

            for (let z = 0; z < 64; z++) {
                locs[level][x][z] = [];
            }
        }
    }

    let locId = -1;
    while (true) {
        const deltaId = data.gVarSmart();
        if (deltaId === 0) {
            break;
        }

        locId += deltaId;

        let locData = 0;
        while (true) {
            const deltaData = data.gsmart();
            if (deltaData === 0) {
                break;
            }

            locData += deltaData - 1;

            const locZ = locData & 0x3f;
            const locX = (locData >> 6) & 0x3f;
            const locLevel = locData >> 12;

            const locInfo = data.g1();
            const locShape = locInfo >> 2;
            const locAngle = locInfo & 3;

            if (locLevel < 0 || locLevel > 3 || locX < 0 || locX > 63 || locZ < 0 || locZ > 63) {
                throw new Error(`corrupt loc entry (level=${locLevel}, x=${locX}, z=${locZ}) - likely bad/missing xtea key`);
            }

            locs[locLevel][locX][locZ].push({
                id: locId,
                shape: locShape,
                angle: locAngle
            });
        }
    }

    return locs;
}

async function main() {
    const cacheId = process.env.CACHE_ID ? Number(process.env.CACHE_ID) : OpenRs2.RS2_500.id;
    const rs2 = new OpenRs2(cacheId);

    console.time('maps');

    const ok = await rs2.predownload();
    if (!ok) {
        printFatalError(`Failed to download cache ${cacheId} from OpenRS2`);
        return;
    }

    await rs2.loadKeys();
    await rs2.loadMapIndex();

    if (!rs2.mapIndex) {
        printFatalError('Failed to load map index (archive 255/5) from cache');
        return;
    }

    const outDir = `${Environment.BUILD_SRC_DIR}/maps`;
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    let unpacked = 0;

    for (let x = 0; x < 256; x++) {
        for (let z = 0; z < 256; z++) {
            const landGroupId = rs2.getMapGroupId('m', x, z);
            const locGroupId = rs2.getMapGroupId('l', x, z);

            if (landGroupId === -1 && locGroupId === -1) {
                continue;
            }

            let landData: Uint8Array | null = null;
            let locData: Uint8Array | null = null;

            if (landGroupId !== -1) {
                const packed = await rs2.getGroup(5, landGroupId);
                if (packed) {
                    rs2.mapIndex.packed[landGroupId] = packed;
                    if (rs2.mapIndex.unpackGroup(landGroupId, [])) {
                        landData = rs2.mapIndex.unpacked[landGroupId]?.[0] ?? null;
                    } else {
                        printWarning(`Failed to unpack land for ${x}_${z}`);
                    }
                }
            }

            if (locGroupId !== -1) {
                const packed = await rs2.getGroup(5, locGroupId);
                if (packed) {
                    rs2.mapIndex.packed[locGroupId] = packed;
                    const key = rs2.getKey(x, z);
                    const ok = rs2.mapIndex.unpackGroup(locGroupId, key);
                    if (ok) {
                        locData = rs2.mapIndex.unpacked[locGroupId]?.[0] ?? null;
                    } else {
                        printWarning(`Failed to unpack/decrypt locs for ${x}_${z}${rs2.hasKey(x, z) ? '' : ' (no xtea key found)'}`);
                    }
                }
            }

            if (!landData && !locData) {
                continue;
            }

            console.log(`Unpacking map for ${x}_${z}`);

            let land: ReturnType<typeof readLand> | null = null;
            let locs: ReturnType<typeof readLocs> | null = null;

            try {
                if (landData) {
                    land = readLand(new Packet(landData));
                }
                if (locData) {
                    locs = readLocs(new Packet(locData));
                }
            } catch (err) {
                printWarning(`Skipping ${x}_${z}: ${err instanceof Error ? err.message : err}`);
                continue;
            }

            unpacked++;

            const outPath = `${outDir}/m${x}_${z}.jm2`;

            // preserve any hand-authored NPC/OBJ sections from a previous unpack
            const saved: string[] = [];
            if (fs.existsSync(outPath)) {
                const existing = fs.readFileSync(outPath, 'utf8').split(/\r?\n/);
                let hasNpcObj = false;
                for (const line of existing) {
                    if (line.startsWith('==== NPC ====') || line.startsWith('==== OBJ ====')) {
                        hasNpcObj = true;
                    }
                    if (hasNpcObj) {
                        saved.push(line);
                    }
                }
            }

            let output = '';

            if (land) {
                let section = '';
                for (let level = 0; level < 4; level++) {
                    for (let lx = 0; lx < 64; lx++) {
                        for (let lz = 0; lz < 64; lz++) {
                            let str = '';

                            if (land.heightmap[level][lx][lz] !== -1) {
                                str += `h${land.heightmap[level][lx][lz]} `;
                            }

                            if (land.overlayIds[level][lx][lz] !== -1) {
                                if (land.overlayShape[level][lx][lz] !== -1 && land.overlayShape[level][lx][lz] !== 0 && land.overlayRotation[level][lx][lz] !== -1 && land.overlayRotation[level][lx][lz] !== 0) {
                                    str += `o${land.overlayIds[level][lx][lz]};${land.overlayShape[level][lx][lz]};${land.overlayRotation[level][lx][lz]} `;
                                } else if (land.overlayShape[level][lx][lz] !== -1 && land.overlayShape[level][lx][lz] !== 0) {
                                    str += `o${land.overlayIds[level][lx][lz]};${land.overlayShape[level][lx][lz]} `;
                                } else {
                                    str += `o${land.overlayIds[level][lx][lz]} `;
                                }
                            }

                            if (land.flags[level][lx][lz] !== -1) {
                                str += `f${land.flags[level][lx][lz]} `;
                            }

                            if (land.underlay[level][lx][lz] !== -1) {
                                str += `u${land.underlay[level][lx][lz]} `;
                            }

                            if (str.length) {
                                section += `${level} ${lx} ${lz}: ${str.trimEnd()}\n`;
                            }
                        }
                    }
                }

                output += '==== MAP ====\n' + section;
            }

            if (locs) {
                let section = '';
                for (let level = 0; level < 4; level++) {
                    for (let lx = 0; lx < 64; lx++) {
                        for (let lz = 0; lz < 64; lz++) {
                            if (!locs[level][lx][lz].length) {
                                continue;
                            }

                            for (let i = 0; i < locs[level][lx][lz].length; i++) {
                                const loc = locs[level][lx][lz][i];
                                if (loc.angle === 0) {
                                    section += `${level} ${lx} ${lz}: ${loc.id} ${loc.shape}\n`;
                                } else {
                                    section += `${level} ${lx} ${lz}: ${loc.id} ${loc.shape} ${loc.angle}\n`;
                                }
                            }
                        }
                    }
                }

                output += (output.length ? '\n' : '') + '==== LOC ====\n' + section;
            }

            if (saved.length) {
                output += '\n' + saved.join('\n');
            }

            fs.writeFileSync(outPath, output);
        }
    }

    console.timeEnd('maps');
    console.log(`Unpacked ${unpacked} mapsquares to ${outDir}`);
}

main();