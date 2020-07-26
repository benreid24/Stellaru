def get_empires(state):
    return {
        cid: empire['name'] 
        for cid, empire in state['country'].items() if isinstance(empire, dict)
    }


