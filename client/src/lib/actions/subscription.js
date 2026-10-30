import { serverMutate } from "../core/server"

export const createSubscription = async (subsInfo) => {
    return serverMutate('/api/subscription', subsInfo)
}