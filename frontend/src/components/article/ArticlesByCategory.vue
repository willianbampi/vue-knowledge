<template>
    <div class="articles-by-category">
        <PageTitle icon="fa fa-folder-o" :title="category.name" description="Categoria"></PageTitle>
        <ul>
            <li v-for="article in articles" :key="article.id">
                <ArticleItem :article="article"></ArticleItem>
            </li>
        </ul>
        <div class="load-more">
            <button v-if="loadMore" class="btn btn-lg btn-outline-primary" @click="getArticles">Carregar mais Artigos</button>
        </div>
    </div>
</template>

<script>

    import { baseApiUrl, showError } from '@/global'
    import axios from 'axios'
    import PageTitle from '../template/PageTitle'
    import ArticleItem from './ArticleItem'

    export default {
        name: 'ArticlesByCategory',
        components: { PageTitle,ArticleItem },
        data: function() {
            return {
                category: {},
                articles: [],
                page: 1,
                loadMore: true
            }
        },
        methods: {
            getCategory() {
                const categoryId = this.category.id
                const finalUrl = `${baseApiUrl}/categories/${categoryId}`
                axios.get(finalUrl)
                    .then(res => this.category = res.data)
                    .catch(showError)
            },
            getArticles() {
                const categoryId = this.category.id
                const finalUrl = `${baseApiUrl}/categories/${categoryId}/articles?page=${this.page}`
                axios(finalUrl)
                    .then(res => {
                        this.articles = this.articles.concat(res.data)
                        this.page++
                        if(res.data.length === 0) {
                            this.loadMore = false
                        }
                    })
                    .catch(showError)
            }
        },
        watch: {
            $route(to) {
                this.category.id = to.params.id
                this.articles = []
                this.page = 1
                this.loadMore = true
                this.getCategory()
                this.getArticles()
            }
        },
        mounted() {
            this.category.id = this.$route.params.id
            this.getCategory()
            this.getArticles()
        }
    }
</script>

<style>
    .articles-by-category ul {
        list-style-type: none;
        padding: 0px;
    }

    .articles-by-category .load-more {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 40px 0px;
    }

    .articles-by-category .load-more .btn {
        color: #3282CD;
        background-color: #EFEFEF;
        border-color: #3282CD;
    }

    .articles-by-category .load-more .btn:visited,
    .articles-by-category .load-more .btn:active {
        color: #DDD;
        background-color: #3282CD;
        border-color: #3282CD;
    }
</style>