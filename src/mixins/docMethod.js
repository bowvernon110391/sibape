export default {
    methods: {
        docHasLink(doc, rel) {
            if (doc.links) {
                // check by filtering it
                return doc.links.filter(e => e.rel == rel).length > 0
            }
            return false
        },

        // grab link detail
        docGetLinkDetails: function (doc, rel) {
            if (doc.links) {
                var filtered = doc.links.filter(e => e.rel == rel)

                if (filtered.length) {
                    var link = filtered[0]
                    return {
                        doctype: link.rel,
                        id: link.uri.match(/^\/.+\/(\d+)$/i)[1]
                    }
                }
            }
            return false
        },
    }
}