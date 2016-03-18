declare var listDiff2: diffModule.diffFunc

declare module diffModule {
    enum MoveType {
        REMOVE = 0,
        INSERT = 1
    }
    interface MovesResult {
        index: number
        type: MoveType
        item?: any
    }
    interface DiffResult {
        moves: Array<MovesResult>
        children: Array<any>
    }
    export interface diffFunc {
        (oldList: Array<any>,newList: Array<any>,key: string): DiffResult
    }
}

declare module "list-diff2" {
    export default listDiff2
}