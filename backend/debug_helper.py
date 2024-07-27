from engine import finder, parser, extractor


def get_latest():
    saves = finder.find_saves()
    saves = sorted(saves, key=lambda x: x.time(), reverse=True)
    return saves[0]


def main():
    print('Finding most recent save...')
    save = get_latest()
    print('Parsing save...')
    meta, state = parser.parse_save(save.get_file(True))
    print('Building snapshot...')
    snapshot = extractor.build_snapshot_from_loaded(state)
    print(snapshot)


if __name__ == '__main__':
    main()
