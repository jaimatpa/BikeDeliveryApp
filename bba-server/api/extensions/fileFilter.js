const matchAnything = /.*/

function isValid(file, accept) {
  let valid = validTypes(accept)
  let isValid = valid.extensions.reduce((prev, regex) => prev || !!file.originalname.match(regex), false) || valid.mimetypes.reduce((prev, regex) => prev || !!file.mimetype.match(regex), false)
  return isValid
}

function validTypes(accept) {
  let validated = validatedAccept(accept)
	if(validated) {
		return {
			extensions: validated.extensions
				.map((ext) => ext.replace(/(\W)/g, "\\$1")) // Escape all potential regex tokens
				.map((rgxstr) => new RegExp(`${rgxstr}$`, "i")), // Transform into regex to look for extension
			mimetypes:  validated.mimetypes
				.map((mt) => mt.replace(/([\-\+\/])/g, "\\$1")) // Escape special characters
				.map((mt) => mt.replace(/\*/g, "(?:[A-Za-z0-9\\-\\+]*)*")) // Enable wildcards
				.map((rgxstr) => new RegExp(`^${rgxstr}$`)), // Transform into regex
		}
	} else {
		return {
			extensions: [matchAnything],
			mimetypes: [matchAnything],
		}
	}
}

function validatedAccept(accept) {
	if(accept) {
		return {
			extensions:
				accept.split(",")
					.filter((type) =>
						type.match(/^\.(?!.*\/)/)), // Get only extension filters
			mimetypes:
				accept.split(",")
					.filter((type) =>
						type.match(/^(?:(?:[A-Za-z0-9\-\+]*)|\*)\/(?:(?:[A-Za-z0-9\-\+]*)|\*)$/)), // Get only mimetype filters
		}
	} else {
		return null
	}
}

module.exports = { isValid }
