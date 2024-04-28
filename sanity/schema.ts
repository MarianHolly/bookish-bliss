import { type SchemaTypeDefinition } from 'sanity'

// schemas
import product from './schemas/product-schema'
import category from './schemas/category-schema'
import publisher from './schemas/publisher-schema'
import site from './schemas/site-schema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [ product, category, publisher, site ],
}
