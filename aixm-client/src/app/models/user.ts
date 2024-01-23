export class User {
    id: number | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    role!: string;
    email!: string;
    password: string | undefined;
    changePassword: boolean = false;
}
