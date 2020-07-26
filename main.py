from stellaru import finder
from stellaru import parser

def main():
    print('Finding saves')
    save_dirs = finder.get_save_dirs()
    watcher = finder.find_save(save_dirs, False)
    print(f'Got latest save: {watcher.get_name()}')
    
    meta, state = parser.parse_save(watcher.get_file())


if __name__ == '__main__':
    main()
