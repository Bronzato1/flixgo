export class User {

    public id: number;
    public userName: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public status: number; // 0: APPROVED - 1: BANNED - 2: DELETED

    static fromObject(src) {
        var tmpObj: User = Object.assign(new User(), src);
        tmpObj.status = 0;
        return tmpObj;
    }
}