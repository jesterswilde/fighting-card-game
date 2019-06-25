import {h, Component} from 'preact'; 
import { dispatchToPathString as to } from '../../path/dispatch';
import {createUserWithEmail} from '../../user/dispatch'; 

interface LoginState{
    email: string
    password: string
    error?: string
}

class Login extends Component<{}, LoginState>{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
        }
    }
    render(){
       
        return <div class="login">
        <div class="title">Create Account: </div>
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
                onClick={async(e)=>{
                    e.preventDefault(); 
                    const error = await createUserWithEmail(this.state.email, this.state.password)
                    if(error){
                        this.setState({error}); 
                    }
                }}
            > 
                Create Account 
            </button>
            {this.state.error && <div class="error">Error: {this.state.error}</div>}
            <div class='mt-2'>
                Already have an account?
            <button 
                class="btn btn-sml btn-primary"
                onClick={()=> to('/user/login')}
            > Login </button> 
            </div>
        </form>
    </div>
    }
    emailChange = (e: Event)=>{
        const el = e.target as HTMLInputElement; 
        this.setState({email: el.value}); 
    }
    passwordChange = (e: Event)=>{
        const el = e.target as HTMLInputElement; 
        this.setState({password: el.value}); 
    }
}

export default Login; 