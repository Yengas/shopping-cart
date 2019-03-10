# shopping-cart
This is the pure business logic package, for the shopping cart implementation. It is stored as a separate folder to isolate everything related to the implementation(class definitions, constants, tests), so it may be shared/moved to somewhere else, and it will be easier to differentiate the code related to business logic from the interface/dao code.

## Notes
- No getter/setter methods has been declared on value classes, because they have been used as simple immutable data classes and are not modified.
- No unit tests were written for the value class constructors, we would not need them with a typed OOP language.
- No concept of reference id was introduced to the Product/Category classes, two instances are considered equal if their reference is equal. This can be changed later by adding ID to the values classes, and changing the equality function.
