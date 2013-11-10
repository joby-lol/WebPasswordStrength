module.exports = function(grunt) {
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		watch: {
			js: {
				files:[
					'source/js/jsWebPasswordStrength.js',
					'source/js/jsWebPasswordStrength.widget.js',
					'source/js/jsWebPasswordStrength.jQuery.js'
				],
				tasks:['uglify']
			}
		},

		uglify: {
			options:{
				banner: '/*!\n<%=pkg.name%> <%=pkg.version%> (<%=grunt.template.today("yyyy-mm-dd")%>)\n<%=pkg.homepage%>\nLicense: <%=pkg.license%>\n\n<%=pkg.licenseText%>\n*/\n'
			},
			build: {
				files: {
					'jsWebPasswordStrength.min.js':[
						'source/js/jsWebPasswordStrength.js'
					],
					'jsWebPasswordStrength.widget.min.js':[
						'source/js/jsWebPasswordStrength.js',
						'source/js/jsWebPasswordStrength.widget.js'
					],
					'jsWebPasswordStrength.jQuery.min.js':[
						'source/js/jsWebPasswordStrength.js',
						'source/js/jsWebPasswordStrength.widget.js',
						'source/js/jsWebPasswordStrength.jQuery.js'
					]
				}
			}
		}

	});

	//default tasks
	grunt.registerTask('default',['uglify']);
}