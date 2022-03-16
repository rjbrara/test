const convertStatusText = value => {
    switch (value) {
        case 0:
            return 'Pending'
        case 1:
            return 'Success'
        default:
            return null
    }
}

export default convertStatusText