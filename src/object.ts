/**
 * BaseObject
 */
class BaseObject {
    constructor() {
        
    }
    hashCode(): number {
        return 0
    }
    
    equals(otherObject: BaseObject): boolean {
        return this.hashCode() === otherObject.hashCode()
    }
}

export default BaseObject