from stellaru import finder
from stellaru import parser

def main():
    print('Finding saves')
    save_dir = finder.get_save_dir()
    watcher = finder.find_save(save_dir, False)
    print(f'Got latest save: {watcher.get_name()}')
    
    parser.parse_save(watcher.get_file())


if __name__ == '__main__':
    main()
