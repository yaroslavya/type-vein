[note] reduction happens by taking two criteria and reducing one from another.

This is a required part for our future caching mechanism - when a query comes in,
it'll probably have a filter (Criteria) applied to it, like "where id is in (1, 2)".

If we've already loaded the entity where id == 1, we should only additionally load
the entity with id == 2.

Therefore a criterion like { op: "==", value: 1 } should reduce a criterion
{ op: "in", values: [1, 2] } to { op: "==", value: 2 }
