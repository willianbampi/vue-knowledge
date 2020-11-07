<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}">
		<Header title="Base de Conhecimento" :hiddeToggle="!user" :hideUserDropdown="!user"></Header>
		<Menu v-if="user"></Menu>
		<Loading v-if="validatingToken"></Loading>
		<Content v-else></Content>
		<Footer></Footer>
	</div>
</template>

<script>

	import axios from 'axios'
	import { mapState } from 'vuex'

	import { baseApiUrl, userKey } from '@/global'
	import Header from '@/components/template/Header'
	import Menu from '@/components/template/Menu'
	import Content from '@/components/template/Content'
	import Footer from '@/components/template/Footer'
	import Loading from '@/components/template/Loading'

	export default {
		name: "App",
		components: { Header, Menu, Content, Footer, Loading },
		computed: mapState(['isMenuVisible', 'user']),
		data: function() {
			return {
				validatingToken: true
			}
		},
		methods: {
			async validateToken() {
				this.validatingToken = true
				
				const json = localStorage.getItem(userKey)
				const userData = JSON.parse(json)
				
				this.$store.commit('setUser', null)
				
				if(!userData) {
					this.validatingToken = false
					this.$router.push({ name: 'auth' })
					return
				}
				
				const finalUrl = `${baseApiUrl}/validateToken`
				const res = await axios.post(finalUrl, userData)
				
				if(res.data) {
					this.$store.commit('setUser', userData)
					if(this.$mq === 'xs' || this.$mq === 'sm') {
						this.$store.commit('toggleMenu', false)
					}
				} else {
					localStorage.removeItem(userKey)
					this.$router.push({ name: 'auth' })
				}

				this.validatingToken = false

			}
		},
		created() {
			this.validateToken()
		}
	}

</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0px;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		height: 100vh;
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 300px 1fr;
		grid-template-areas: 
			"header header"
			"menu content"
			"footer footer"
		;
	}

	#app.hide-menu {
		grid-template-areas: 
			"header header"
			"content content"
			"footer footer"
		;
	}

	.toasted-container .toasted.primary.sucess {
		background: #4BAD7C;
		box-shadow: 0px 1px 5px rgba(75, 173, 124, 0.2);
	}

	.toasted-container .toasted.primary.error {
		background: #C75C5C;
		box-shadow: 0px 1px 5px rgba(199, 92, 92, 0.2);
	}
</style>