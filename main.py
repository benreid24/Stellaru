from stellaru import finder
from stellaru import parser
from stellaru import loader


def main():
    print('Finding saves')
    save_dirs = finder.get_save_dirs()
    watcher = finder.find_save(save_dirs, False)
    print(f'Got latest save: {watcher.get_name()}')
    
    meta, state = parser.parse_save(watcher.get_file())
    empires = loader.get_empires(state)
    for empire_id, empire in empires.items():
        print(f'{empire_id}: {empire}')
    cid = input('Empire to load: ')
    if cid not in empires:
        print('Invalid empire, goodbye')
        return

    # TODO - get resource breakdowns


if __name__ == '__main__':
    main()
