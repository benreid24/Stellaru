import sys
import random

from backend.engine.watcher import FileWatcher
from backend.engine import engine
from backend.engine import snapper
from backend.engine import faker


def main():
    if len(sys.argv) != 3:
        print('USAGE: data_faker.py <save_folder> <months to add>')
    folder = sys.argv[1]
    steps = int(sys.argv[2])

    watcher = FileWatcher(folder)
    if not watcher.valid:
        print(f'Invalid Stellaris save: {folder}')
    
    print('Loading save and building snapshot')
    snap = snapper.build_snapshot_from_watcher(watcher)

    print(f'Creating {steps} extra months of data')
    snaps = [snap]
    for i in range(0, steps):
        snaps.append(faker.fake_snap(snaps[-1]))

    print(f'Saving new data')
    engine._flush_save({'snaps': snaps, 'directory': folder})


if __name__ == '__main__':
    main()
