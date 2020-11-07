<template>
    <div class="user-admin">
        <b-form>
            <input id="user.id" type="hidden" v-model="user.id">
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Nome" label-for="user-name">
                        <b-form-input id="user-name" type="text" v-model="user.name" required :readonly="mode === 'remove'" placeholder="Informe o Nome do Usuário"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Email" label-for="user-email">
                        <b-form-input id="user-email" type="text" v-model="user.email" required :readonly="mode === 'remove'" placeholder="Informe o E-mail do Usuário"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row v-if="mode === 'save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Senha" label-for="user-password">
                        <b-form-input id="user-password" type="password" v-model="user.password" required placeholder="Informe a Senha do Usuário"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Confirmação de Senha" label-for="user-confirm-password">
                        <b-form-input id="user-confirm-password" type="password" v-model="user.confirmPassword" required placeholder="Confirme a Senha do Usuário"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-form-checkbox v-if="mode === 'save'" id="user-admin" class="mt-3 mb-4" v-model="user.admin">Administrador</b-form-checkbox>
            <b-row class="mt-3 mb-5">
                <b-col xs="12">
                    <b-button class="button-save" v-if="mode === 'save'" @click="save">Salvar</b-button>
                    <b-button class="button-remove" v-if="mode === 'remove'" @click="remove">Remover</b-button>
                    <b-button class="button-cancel ml-3" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <b-table class="table" hover striped :items="users" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button class="button-edit mr-2" @click="loadUser(data.item, 'save')">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button class="button-delete" @click="loadUser(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="countRecords" :per-page="recordsPerPage"></b-pagination>
    </div>
</template>

<script>

    import { baseApiUrl, showError } from '@/global'
    import axios from 'axios'

    export default {
        name: 'UserAdmin',
        data: function() {
            return {
                mode: 'save',
                user: {},
                users: [],
                page: 1,
                recordsPerPage: 0,
                countRecords: 0,
                fields: [
                    { key: 'id', label: 'Código', sortable: true },
                    { key: 'name', label: 'Nome', sortable: true },
                    { key: 'email', label: 'E-mail', sortable: true },
                    { key: 'admin', label: 'Administrador', sortable: true, formatter: value => value ? 'Sim' : 'Não' },
                    { key: 'actions', label: 'Ações' }
                ]
            }
        },
        methods: {
            loadUsers() {
                const url = `${baseApiUrl}/users?page=${this.page}`
                axios.get(url)
                    .then(res => {
                        this.users = res.data.data
                        this.countRecords = res.data.countRecords
                        this.recordsPerPage = res.data.recordsPerPage
                    })
                    .catch(showError)
            },
            reset() {
                this.mode = 'save'
                this.user = {}
                this.loadUsers()
            },
            save() {
                const method = this.user.id ? 'put' : 'post'
                const userId = this.user.id ? `/${this.user.id}` : ''
                const finalUrl = `${baseApiUrl}/users${userId}`
                axios[method](finalUrl, this.user)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                    })
                    .catch(showError)
            },
            remove() {
                const userId = this.user.id
                const finalUrl = `${baseApiUrl}/users${userId}`
                axios.delete(finalUrl)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                    })
                    .catch(showError)
            },
            loadUser(user, mode = 'save') {
                this.mode = mode
                this.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    confirmPassword: user.confirmPassword,
                    admin: user.admin
                }
            }
        },
        watch: {
            page() {
                this.loadUsers()
            }
        },
        mounted() {
            this.loadUsers()
        }
    }
</script>

<style>
    .user-admin .button-save {
        background: #4BAD7C;
        border: 1px solid #4BAD7C;
    }

    .user-admin .button-remove {
        background: #C75C5C;
        border: 1px solid #C75C5C;
    }

    .user-admin .button-cancel {
       background: #4f5D73;
        border: 1px solid #4f5D73;
    }

    .user-admin .table .button-edit {
        background: #C4AB5E;
        border: 1px solid #C4AB5E;
    }

    .user-admin .table .button-delete {
        background: #C75C5C;
        border: 1px solid #C75C5C;
    }

    .page-item.active .page-link {
        background-color: #3282CD;
        border-color: #3282CD;
    }
</style>