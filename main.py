from stellaru import loader
from stellaru import finder

def main():
    print('Finding saves')
    save_dir = finder.get_save_dir()
    watcher = finder.find_save(save_dir, False)
    print(f'Got latest save: {watcher.get_name()}')


if __name__ == '__main__':
    main()
