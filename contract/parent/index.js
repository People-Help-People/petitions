
export function handle(state, action) {

    if (action.input.function === 'enlist') {
        if (typeof action.input.listingId === 'undefined') {
            throw new ContractError(`PetitionId cant be null`)
        }
        if (state.petitions.hasOwnProperty(action.input.listingId)) {
            throw new ContractError(`PetitionId already exists`)
        }
        state.petitions[action.input.listingId] = 1
        return { state }
    }

    throw new ContractError('Invalid input')
}
