export enum UserActionEnum{
    LOGIN = "userLogin",
    LOGOUT = "userLogout",
}

export interface UserLoginAction{
    type: UserActionEnum.LOGIN
    username: string,
    token: string
}

export interface UserLogoutAction{
    type: UserActionEnum.LOGOUT
}

export type UserActions = UserLoginAction | UserLogoutAction