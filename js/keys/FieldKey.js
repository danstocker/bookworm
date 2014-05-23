/*global dessert, troop, sntls, bookworm */
troop.postpone(bookworm, 'FieldKey', function () {
    "use strict";

    var base = bookworm.EntityKey,
        self = base.extend();

    /**
     * @name bookworm.FieldKey.create
     * @function
     * @param {string} documentType
     * @param {string} documentId
     * @param {string} fieldName
     * @returns {bookworm.FieldKey}
     */

    /**
     * Represents a key to a document node.
     * @class
     * @extends bookworm.EntityKey
     */
    bookworm.FieldKey = self
        .addMethods(/** @lends bookworm.FieldKey# */{
            /**
             * @param {string} documentType
             * @param {string} documentId
             * @param {string} fieldName
             * @ignore
             */
            init: function (documentType, documentId, fieldName) {
                /**
                 * Document key reference.
                 * @type {bookworm.DocumentKey}
                 */
                this.documentKey = bookworm.DocumentKey.create(documentType, documentId);

                /**
                 * Name of current field.
                 * @type {string}
                 */
                this.fieldName = fieldName;
            },

            /**
             * @param {bookworm.FieldKey} fieldKey
             */
            equals: function (fieldKey) {
                return this.documentKey.equals(fieldKey.documentKey) &&
                       this.fieldName === fieldKey.fieldName;
            },

            /**
             * Creates an ItemKey instance based on the current field key and the specified item ID.
             * @param {string} itemId
             * @returns {bookworm.ItemKey}
             */
            getItemKey: function (itemId) {
                var documentKey = this.documentKey;

                return bookworm.ItemKey.create(
                    documentKey.documentType,
                    documentKey.documentId,
                    this.fieldName,
                    itemId
                );
            },

            /**
             * @returns {sntls.Path}
             */
            getEntityPath: function () {
                var documentKey = this.documentKey,
                    result = documentKey.getEntityPath();

                if (documentKey.hasDocumentMeta()) {
                    result.appendKey('fields');
                }

                result.appendKey(this.fieldName);

                return result;
            },

            /**
             * @returns {sntls.Path}
             */
            getMetaPath: function () {
                var metaFieldKey = ['document', this.documentKey.documentType, this.fieldName].toFieldKey();
                return metaFieldKey.getEntityPath();
            },

            /**
             * Tells whether Field entity identified by the current key has metadata associated with it.
             * @returns {boolean}
             */
            hasFieldMeta: function () {
                return bookworm.metadata.getNode(this.getMetaPath().appendKey('hasFieldMeta'));
            },

            /**
             * Retrieves field type string for the Field entity identified by the current key.
             * @returns {string}
             */
            getFieldType: function () {
                var metadata = bookworm.metadata,
                    typeMetaPath = this.getMetaPath();

                return metadata.getNode(typeMetaPath.clone().appendKey('fieldType')) ||
                       metadata.getNode(typeMetaPath);
            },

            /**
             * @returns {string}
             */
            toString: function () {
                return this.documentKey.toString() + '/' + encodeURIComponent(this.fieldName);
            }
        });
});

troop.amendPostponed(bookworm, 'EntityKey', function () {
    "use strict";

    bookworm.EntityKey
        .addSurrogate(bookworm, 'FieldKey', function () {
            return arguments.length === 3;
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path
        .addMethods(/** @lends sntls.Path */{
            /**
             * Converts cache Path to FieldKey instance.
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                return this.asArray.toFieldKey();
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** Tells whether expression is a FieldKey */
        isFieldKey: function (expr) {
            return bookworm.FieldKey.isBaseOf(expr);
        },

        /** Tells whether expression is a FieldKey (and not one of its subclasses) */
        isFieldKeyStrict: function (expr) {
            return bookworm.FieldKey.isBaseOf(expr) &&
                   expr.getBase() === bookworm.FieldKey;
        },

        /** Tells whether expression is optionally a FieldKey */
        isFieldKeyOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   bookworm.FieldKey.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to a FieldKey
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                var parts = this.split('/');

                return bookworm.FieldKey.create(
                    decodeURIComponent(parts[0]),
                    decodeURIComponent(parts[1]),
                    decodeURIComponent(parts[2])
                );
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts Array of strings to a FieldKey instance.
             * @returns {bookworm.FieldKey}
             */
            toFieldKey: function () {
                return bookworm.FieldKey.create(this[0], this[1], this[2]);
            }
        },
        false, false, false
    );
}());
