<template>
    <div class="article-admin">
        <b-form>
            <input id="article.id" type="hidden" v-model="article.id">
            <b-row>
                <b-col xs="12">
                    <b-form-group label="Nome" label-for="article-name">
                        <b-form-input id="article-name" type="text" v-model="article.name" required :readonly="mode === 'remove'" placeholder="Informe o Nome do Artigo"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-form-group label="Descrição" label-for="article-description">
                        <b-form-input id="article-description" type="text" v-model="article.description" required :readonly="mode === 'remove'" placeholder="Informe a Descrição do Artigo"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row v-if="mode === 'save'">
                <b-col xs="12">
                    <b-form-group label="URL da Imagem" label-for="article-imageUrl">
                        <b-form-input id="article-imageUrl" type="text" v-model="article.imageUrl" placeholder="Informe a URL da Imagem do Artigo"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-form-group v-if="mode === 'save'" label="Categoria" label-for="article-categoryId">
                        <b-form-select id="article-categoryId" :options="categories" v-model="article.categoryId"></b-form-select>
                    </b-form-group>
                    <b-form-group v-if="mode === 'remove'" label="Categoria" label-for="article-categoryId">
                        <b-form-input id="article-categoryId" type="text" v-model="article.categoryId" :readonly="mode === 'remove'"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-form-group v-if="mode === 'save'" label="Autor" label-for="article-userId">
                        <b-form-select id="article-userId" :options="users" v-model="article.userId"></b-form-select>
                    </b-form-group>
                    <b-form-group v-if="mode === 'remove'" label="Autor" label-for="article-userId">
                        <b-form-input id="article-userId" type="text" v-model="article.userId" :readonly="mode === 'remove'"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row v-if="mode === 'save'">
                <b-col xs="12">
                    <b-form-group v-if="mode === 'save'" label="Conteúdo" label-for="article-content">
                        <VueEditor id="article-content" v-model="article.content" placeholder="Informe o Conteúdo do Artigo"></VueEditor>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="mt-3 mb-5">
                <b-col xs="12">
                    <b-button class="button-save" v-if="mode === 'save'" @click="save">Salvar</b-button>
                    <b-button class="button-remove" v-if="mode === 'remove'" @click="remove">Remover</b-button>
                    <b-button class="button-cancel ml-3" @click="reset">Cancelar</b-button>
                </b-col>
            </b-row>
        </b-form>
        <b-table class="table" hover striped :items="articles" :fields="fields">
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

    import { VueEditor } from 'vue2-editor'
    import { baseApiUrl, showError } from '@/global'
    import axios from 'axios'

    export default {
        name: 'ArticleAdmin',
        components: { VueEditor },
        data: function() {
            return {
                mode: 'save',
                article: {},
                articles: [],
                categories: [],
                users: [],
                page: 1,
                recordsPerPage: 0,
                countRecords: 0,
                fields: [
                    { key: 'id', label: 'Código', sortable: true },
                    { key: 'name', label: 'Nome', sortable: true },
                    { key: 'description', label: 'Descrição', sortable: true },
                    { key: 'actions', label: 'Ações' }
                ]
            }
        },
        methods: {
            loadArticles() {
                const url = `${baseApiUrl}/articles?page=${this.page}`
                axios.get(url)
                    .then(res => {
                        this.articles = res.data.data
                        this.countRecords = res.data.countRecords
                        this.recordsPerPage = res.data.recordsPerPage
                    })
                    .catch(showError)
            },
            reset() {
                this.mode = 'save'
                this.articles = {}
                this.loadArticles()
            },
            save() {
                const method = this.article.id ? 'put' : 'post'
                const articleId = this.article.id ? `/${this.article.id}` : ''
                const finalUrl = `${baseApiUrl}/articles${articleId}`
                axios[method](finalUrl, this.article)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                    })
                    .catch(showError)
            },
            remove() {
                const articleId = this.article.id
                const finalUrl = `${baseApiUrl}/articles${articleId}`
                axios.delete(finalUrl)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                    })
                    .catch(showError)
            },
            loadArticle(article, mode = 'save') {
                this.mode = mode
                const articleId = article.id
                const finalUrl = `${baseApiUrl}/articles/${articleId}`
                axios.get(finalUrl)
                    .then(res => this.article = res.data)
                    .catch(showError)
            },
            loadCategories() {
                const finalUrl = `${baseApiUrl}/categories`
                axios.get(finalUrl)
                    .then(res => {
                        this.categories = res.data.data.map(category => {
                            return { value: category.id, text: category.path }
                        })
                    })
                    .catch(showError)
            },
            loadUsers() {
                const finalUrl = `${baseApiUrl}/users`
                axios.get(finalUrl)
                    .then(res => {
                        this.users = res.data.data.map(user => {
                            return { value: user.id, text: `${user.name} - ${user.email}` }
                        })
                    })
                    .catch(showError)
            }
        },
        watch: {
            page() {
                this.loadArticles()
            }
        },
        mounted() {
            this.loadUsers()
            this.loadCategories()
            this.loadArticles()
        }
    }
</script>

<style>
    .article-admin .button-save {
        background: #4BAD7C;
        border: 1px solid #4BAD7C;
    }

    .article-admin .button-remove {
        background: #C75C5C;
        border: 1px solid #C75C5C;
    }

    .article-admin .button-cancel {
       background: #4f5D73;
        border: 1px solid #4f5D73;
    }

    .article-admin .table .button-edit {
        background: #C4AB5E;
        border: 1px solid #C4AB5E;
    }

    .article-admin .table .button-delete {
        background: #C75C5C;
        border: 1px solid #C75C5C;
    }

    .page-item.active .page-link {
        background-color: #3282CD;
        border-color: #3282CD;
    }
</style>