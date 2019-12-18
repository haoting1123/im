<template>
	<text class="uni-badge" v-if="text" style="font-size: 23upx; padding: 5upx 8upx 2upx 8upx; padding-bottom: 0; line-height: 28upx;" :class="inverted ? 'uni-badge-' + type + ' uni-badge--' + size + ' uni-badge-inverted' : 'uni-badge-' + type + ' uni-badge--' + size" @click="onClick()">{{text}}</text>
</template>

<script>
	export default {
		name: 'uni-badge',
		props: {
			type: {
				type: String,
				default: 'default'
			},
			inverted: {
				type: Boolean,
				default: false
			},
			text: {
				type: String,
				default: ''
			},
			size: { //small.normal
				type: String,
				default: 'normal'
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	$bage-size:23upx;
	$bage-small:scale(0.8);

	.uni-badge {
		font-family: 'Helvetica Neue', Helvetica, sans-serif;
		box-sizing: border-box;
		font-size: $bage-size;
		line-height: 1;
		min-height: 28upx;
		min-width: 30upx;
		display: inline-block;
		padding: 5upx 8upx;
		color: $uni-text-color;
		border-radius: 35upx;
		background-color: $uni-bg-color-hover;

		&.uni-badge-inverted {
			padding: 0 5px 0 0;
			color: $uni-text-color-grey;
			background-color: transparent;
		}

		&-primary {
			color: $uni-text-color-inverse;
			background-color: $uni-color-primary;

			&.uni-badge-inverted {
				color: $uni-color-primary;
				background-color: transparent
			}
		}

		&-success {
			color: $uni-text-color-inverse;
			background-color: $uni-color-success;

			&.uni-badge-inverted {
				color: $uni-color-success;
				background-color: transparent
			}
		}

		&-warning {
			color: $uni-text-color-inverse;
			background-color: $uni-color-warning;

			&.uni-badge-inverted {
				color: $uni-color-warning;
				background-color: transparent
			}
		}

		&-error {
			color: $uni-text-color-inverse;
			background-color: $uni-color-error;

			&.uni-badge-inverted {
				color: $uni-color-error;
				background-color: transparent
			}
		}

		&--small {
			transform: $bage-small;
			transform-origin: center center;
		}
	}
</style>
