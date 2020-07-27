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
    player_empire = loader.get_player_empire(state)
    breakdown = loader.build_snapshot(state, player_empire)


if __name__ == '__main__':
    main()
