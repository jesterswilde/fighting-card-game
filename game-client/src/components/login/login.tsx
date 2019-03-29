import { h, Component } from 'preact';
import { dispatchToPathString as to } from '../../path/dispatch';
import { loginWithEmail } from '../../user/dispatch';

interface State {
    email: string
    password: string
}

export default class Login extends Component<{}, State>{
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }
    render() {
        return <div class="login">
            <div class="title">Login: </div>
            <form class="form">
                <label for="email">Email: </label>
                <input
                    type="text"
                    id="email"
                    placeholder="you@host.com"
                    onChange={this.emailChange}
                    value={this.state.email}
                />

                <label for="pass">Password: </label>
                <input
                    type="password"
                    id="pass"
                    onChange={this.passwordChange}
                    value={this.state.password}
                />
                <button
                    class="btn btn-primary mt-4"
                    onClick={(e) => {
                        loginWithEmail(this.state.email, this.state.password)
                        e.preventDefault();
                    }}
                >
                    Login
            </button>
                <div class='mt-2'>
                    Don't have an account? Create one instead.
                <button
                        class="btn"
                        onClick={() => to('/user/create')}
                    >
                        Create Account
                </button>
                </div>
            </form>
        </div>
    }
    emailChange = (e: Event) => {
        const el = e.target as HTMLInputElement;
        this.setState({ email: el.value });
    }
    passwordChange = (e: Event) => {
        const el = e.target as HTMLInputElement;
        this.setState({ password: el.value });
    }
}