<template>
    <div class="category-admin">
        <b-form>
            <input id="category.id" type="hidden" v-model="category.id">
            <b-row>
                <b-col xs="12">
                    <b-form-group label="Nome" label-for="category-name">
                        <b-form-input id="category-name" type="text" v-model="category.name" required :readonly="mode === 'remove'" placeholder="Informe o Nome da Categoria"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-form-group v-if="mode === 'save'" label="Categoria Pai" label-for="category-parentId">
                        <b-form-select id="category-parentId" :options="categories" v-model="category.parentId"></b-form-select>
                    </b-form-group>
                    <b-form-group v-if="mode === 'remove'" label="Caminho" label-for="category-path">
                        <b-form-input id="category-path" type="text" v-model="category.path" :readonly="mode === 'remove'"></b-form-input>
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
        <b-table class="table" hover striped :items="categories" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button class="button-edit mr-2" @click="loadCategory(data.item, 'save')">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button class="button-delete" @click="loadCategory(data.item, 'remove')">
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
        name: 'CategoryAdmin',
        data: function() {
            return {
                mode: 'save',
                category: {},
                categories: [],
                page: 1,
                recordsPerPage: 0,
                countRecords: 0,
                fields: [
                    { key: 'id', label: 'Código', sortable: true },
                    { key: 'name', label: 'Nome', sortable: true },
                    { key: 'path', label: 'Caminho', sortable: true },
                    { key: 'actions', label: 'Ações' }
                ]
            }
        },
        methods: {
            loadCategories() {
                const url = `${baseApiUrl}/categories?page=${this.page}`
                axios.get(url)
                    .then(res => {
                        this.categories = res.data.data.map(category => {
                            return { ...category, value: category.id, text: category.path }
                        })
                        this.countRecords = res.data.countRecords
                        this.recordsPerPage = res.data.recordsPerPage
                    })
                    .catch(showError)
            },
            reset() {
                this.mode = 'save'
                this.category = {}
                this.loadCategories()
            },
            save() {
                const method = this.category.id ? 'put' : 'post'
                const categoryId = this.category.id ? `/${this.category.id}` : ''
                const finalUrl = `${baseApiUrl}/categories${categoryId}`
                axios[method](finalUrl, this.category)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                        this.reset()
                    })
                    .catch(showError)
            },
            remove() {
                const categoryId = this.category.id
                const finalUrl = `${baseApiUrl}/categories${categoryId}`
                axios.delete(finalUrl)
                    .then(() => {
                        this.$toasted.global.defaultSuccess()
                    })
                    .catch(showError)
            },
            loadCategory(category, mode = 'save') {
                this.mode = mode
                this.category = {
                    id: category.id,
                    name: category.name,
                    parentId: category.parentId
                }
            }
        },
        watch: {
            page() {
                this.loadCategories()
            }
        },
        mounted() {
            this.loadCategories()
        }
    }
</script>

<style>
    .category-admin .button-save {
        background: #4BAD7C;
        border: 1px solid #4BAD7C;
    }

    .category-admin .button-remove {
        background: #C75C5C;
        border: 1px solid #C75C5C;
    }

    .category-admin .button-cancel {
       background: #4f5D73;
        border: 1px solid #4f5D73;
    }

    .category-admin .table .button-edit {
        background: #C4AB5E;
        border: 1px solid #C4AB5E;
    }

    .category-admin .table .button-delete {
        background: #C75C5C;
        border: 1px solid #C75C5C;
    }

    .page-item.active .page-link {
        background-color: #3282CD;
        border-color: #3282CD;
    }
</style>