import React from "react"
import {
    Typography,
    Paper,
    TextField,
    InputAdornment,
    Button,
    IconButton
} from '@mui/material'

import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material'

import myfetch from '../lib/myfetch'
import useNotification from '../ui/useNotification'
import useWaiting from '../ui/useWaiting'
import {useNavigate} from 'react-router-dom'
import AuthUserContext from "../contexts/AuthUserContext"

export default function Login(){
    const [state, setState] = React.useState({
        email: '',
        password: '',
        showPassword: false
    })
    const {
        email, 
        password,
        showPassword
    } = state

    const {setAuthUser,
        redirectLocation,
        setRedirectLocation
    } = React.useContext(AuthUserContext)

    const {notify, notification} = useNotification()
    const {showWaiting, Waiting} = useWaiting()

    const navigate = useNavigate()


    function handleChange(event){
        setState({...state, [event.target.name]: event.target.value})
    }

    function handleClick(event){
        setState({...state, showPassword: !showPassword})
    }
    
    async function handleSubmit(event){
        event.preventDefault()
        showWaiting(true)
        try{
            const response = await myfetch.post('/users/login', {email, password})
            window.localStorage.setitem(
                import.meta.env.VITE_AUTH_TOKEN_NAME,
                response.token
            )
            
            setAuthUser(response.user)
            notify('Autenticação realizada com sucesso', 'success', 1500, () => {
                if(redirectLocation){
                    const dest = redirectLocation
                    setRedirectLocation(null)
                    navigate(dest, {replace: true})
                }
                else navigate('/', {replace: true})
            }
            )
        }
        catch(error){
            console.error(error)
            notify(error.message, 'error')
        }
        finally{
            showWaiting(false)
        }
    }
    return(
        <>
            <Typography variant="h1" gutterBottom>
                Autentique-se
            </Typography>
            <Paper
                elevation={6}
                sx={{
                    padding: '24px',
                    maxWidth: '500px',
                    margin: 'auto'
                }}
                >
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="email"
                        value={email}
                        label="E-mail"
                        variant="filled"
                        fullWidth
                        onChange={handleChange}
                        sx={{mb: '24px' /* mb = marginButton */}}
                        />
                    <TextField
                        name="password"
                        value={password}
                        label="Password"
                        variant="filled"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        onChange={handleChange}
                        sx={{mb: '24px' /* mb = marginButton */}}
                        InputProps={{
                            endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="alterna a visibilidade da senha"
                                onClick={handleClick}
                                edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility/> }
                                </IconButton>
                            </InputAdornment>
                        }}
                        />

                    <Button
                        variant="contained"
                        type="submit"
                        color="secondary"
                        fullwidth
                    >
                        Send
                    </Button>
                </form>
            </Paper>
        </>
    )
}