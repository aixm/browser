export class User {
    id: number | undefined;
    active: boolean = true;
    firstName: string | undefined;
    lastName: string | undefined;
    company: string | undefined;
    position: string | undefined;
    role!: string;
    email!: string;
    password: string | undefined;
    changePassword: boolean = false;
    activeAt: string | undefined;
}
