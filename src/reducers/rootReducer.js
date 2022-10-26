const initState = {
    orders: []
}

const rootReducer = (state = initState, action) => {
    if (action.type === 'ADD_ORDERS') {
        const orders = state.orders
        const newArr = [...orders, ...action.orders]
        const new_state = {
            ...state,
            orders: newArr
        }
        return new_state
    }
    if (action.type === 'REMOVE_ORDERS') {
        const orders = state.orders
        var filteredArray = orders.filter(function(item) { return !action.orders.includes(item)})
        const new_state = {
            ...state,
            orders: filteredArray
        }
        return new_state
    }
    return state
}

export default rootReducer