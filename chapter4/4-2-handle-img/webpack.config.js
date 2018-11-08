const path = require('path')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PurifyCss = require('purifycss-webpack')
const glob = require('glob-all')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	mode: 'production',
	entry: {
		app: './src/app.js'
	},
	output: {
		/* path.resolve() will return the absolute path of the current working directory. */
		path: path.resolve(__dirname, 'dist'),
		/* Introducing resource paths */
		// publicPath: './dist/',
		/* Initialize packaged file name */
		filename: '[name].bundle.js',
		/* dynamic packaged file name */
		chunkFilename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				/* Processe from the back to the front */
				use: ExtractTextWebpackPlugin.extract({
					/* `loader` should be used when the CSS is not extracted */
					fallback: {
						/* Adds CSS to the DOM by injecting a <style> tag */
						loader: 'style-loader',
						options: {
							/* Reuses a single <style></style> element, instead of adding/removing individual elements for each required module */
							singleton: true,
							/* Transform/Conditionally load CSS by passing a transform/condition function */
							transform: './css.transform.js'
						}
					},
					use: [
						{
							/* The css-loader interprets @import and url() like import/require() and will resolve them. */
							loader: 'css-loader',
							options: {
								/* compress? */
								minimize: true,
								/* Enable/Disable css-modules */
								modules: true,
								/* Configure the generated ident */
								localIdentName: '[path][name]_[local]_[hash:base64:5]'
							}
						},
						{
							/* put css-loader below */
							loader: 'postcss-loader',
							options: {
								/*  webpack requires an identifier (ident) in options when {Function}/require is used (Complex Options). The ident can be freely named as long as it is unique. It's recommended to name it (ident: 'postcss') */
								ident: 'postcss',
								plugins: [
									/* css3 Attribute added vendor prefix */
									require('autoprefixer')(),
									/* Use future css syntax */
									require('postcss-cssnext')(),
									/* Compression optimization css */
									require('cssnano')(),
									/* Sprite: Merge into a single picture */
									require('postcss-sprites')({
										/* Specify output path */
										spritePath: 'dist/assets/imgs/sprites',
										/* handle retina screen */
										retina: true
									})
								]
							}
						},
						{
							/* put css-loader below */
							loader: 'sass-loader'
						}
					]
				})
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['lodash']
						}
					}
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							/* over 1000 handle to base64 */
              limit: 1000,
              /* 使其位于绝对路径地址 */
							/* Set absolute path */
							publicPath: '',
							/* put dist file dialog */
							outputPath: 'dist/',
              /* 不设置的话, 放在 dist 里, 设置后放在 assets 下 */
							/* Set relative path */
							useRelativePath: true
						}
					},
					{
						/* compress img */
						loader: 'img-loader',
						options: {
              /* .png */
							pngquant: {
								/* compress png */
								quality: 80
							}
						}
					}
				]
			},
			{
				test: /\.(eot|woff2?|ttf|svg)$/,
				use: [
					{
            /* A loader for webpack which transforms files into base64 URIs */
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							/* over 5000 handle to base64 */
							limit: 5000,
							/* Set absolute path */
							publicPath: '',
							/* put dist file dialog */
							outputPath: 'dist/',
							/* Set relative path */
							useRelativePath: true
						}
					}
				]
			}
		]
	},
	plugins: [
    new BundleAnalyzerPlugin(),
		/* Extract text from a bundle, or bundles, into a separate file. */
		new ExtractTextWebpackPlugin({
			filename: '[name].min.css',
			/* Extract from all additional chunks(by default it extracts only from the initial chunk) */
			allChunks: false
		}),
		/* put ExtractTextWebpackPlugin below */
		/* css compress */
		new PurifyCss({
			paths: glob.sync([
				path.join(__dirname, './*.html'),
				path.join(__dirname, './src/*.js')
			])
		}),
		/* js compress */
		new UglifyJsPlugin()
	]
}