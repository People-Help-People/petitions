
export function handle(state, action) {

    if (action.input.function === 'sign') {
        if (typeof action.input.signerId === 'undefined') {
            throw new ContractError(`PetitionId cant be null`)
        }
        if (state.signs.hasOwnProperty(action.input.signerId)) {
            throw new ContractError(`PetitionId already exists`)
        }
        state.signs[action.input.signerId] = 1
        return { state }
    }
    throw new ContractError('Invalid input')
}
