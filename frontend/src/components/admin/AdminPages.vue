<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" title="Administração do Sistema" description="Gerenciamento de Cadastros de Artigos, Categorias e Usuários"></PageTitle>
        <div class="admin-pages-tabs">
            <b-card no body>
                <b-tabs card>
                    <b-tab title="Artigos" active>
                        <ArticleAdmin></ArticleAdmin>
                    </b-tab>
                    <b-tab title="Categorias">
                        <CategoryAdmin></CategoryAdmin>
                    </b-tab>
                    <b-tab title="Usuários">
                        <UserAdmin></UserAdmin>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>

    import PageTitle from '../template/PageTitle'
    import ArticleAdmin from './ArticleAdmin'
    import CategoryAdmin from './CategoryAdmin'
    import UserAdmin from './UserAdmin'

    export default {
        name: 'AdminPages',
        components: { PageTitle, ArticleAdmin, CategoryAdmin, UserAdmin }
    }
</script>

<style>
    .admin-pages-tabs,
    .admin-pages-tabs a,
    .admin-pages-tabs .table {
        color: #4f5D73;
    }

    .admin-pages-tabs .card-body .card-header {
        background-color: transparent;
    }
</style>