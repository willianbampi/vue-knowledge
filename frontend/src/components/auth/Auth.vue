<template>
    <div class="auth-content">
        <div class="auth-modal">
            <img src="@/assets/logo.png" width="100" height="100" alt="Logo">
            <hr>
            <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Acesso' }}</div>
            <input  type="text" v-if="showSignup" v-model="user.name" placeholder="Nome">
            <input  type="text" name="email" v-model="user.email" placeholder="E-mail">
            <input  type="password" name="password" v-model="user.password" placeholder="Senha">
            <input  type="password" v-if="showSignup" v-model="user.confirmPassword" placeholder="Confirmação de Senha">
            <button class="button" v-if="showSignup" @click="signup">Cadastrar</button>
            <button class="button" v-else @click="signin">Entrar</button>
            <a href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Já possui cadastro? Acesse aqui!</span>
                <span v-else>Não possui cadastro? Cadastre-se aqui!</span>
            </a>
        </div>
    </div>
</template>

<script>

    import { baseApiUrl, showError, userKey } from '@/global'
    import axios from 'axios'

    export default {
        name: 'Auth',
        data: function() {
            return {
                showSignup: true,
                user: {}
            }
        },
        methods: {
            signin() {
                const finalUrl = `${baseApiUrl}/signin`
                axios.post(finalUrl, this.user)
                    .then(res => {
                        this.$store.commit('setUser', res.data)
                        localStorage.setItem(userKey, JSON.stringify(res.data))
                        this.$router.push({ path: '/' })
                    })
                    .catch(showError)
            },
            signup() {
                const finalUrl = `${baseApiUrl}/signup`
                axios.post(finalUrl, this.user)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.user = {}
                        this.showSignup = false
                    })
                    .catch(showError)
            }
        }
    }
</script>

<style>
    .auth-content {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .auth-modal {
        background-color: #DDD;
        width: 350px;
        padding: 35px;
        box-shadow: 0px 3px 16px 0px rgba(79, 93, 115, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .auth-title {
        font-size: 1.3rem;
        font-weight: 100;
        margin: 20px 0px 20px 0px;
    }

    .auth-modal input {        
        width: 100%;
        margin-bottom: 15px;
        padding: 3px 8px;
        outline: none;
    }

    .auth-modal button {
        padding: 5px 15px;
        margin-top: 20px;
        align-self: center;
        background-color: #3282CD;
        color: #DDD;
        border: 1px solid #3282CD;
        border-radius: 3px;
    }

    .auth-modal .button:visited,
    .auth-modal .button:active {
        background-color: #3282CD;
        color: #DDD;
        border: 1px solid #3282CD;
    }

    .auth-modal a {
        margin-top: 20px;
        color: #3282CD;
    }

    .auth-modal hr {
        border: 0;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(
            to right,
            rgba(79, 93, 115, 0),
            rgba(79, 93, 115, 0.7),
            rgba(79, 93, 115, 0)
        );
    }
</style>