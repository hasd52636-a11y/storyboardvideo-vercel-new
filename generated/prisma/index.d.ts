
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Symbol
 * 
 */
export type Symbol = $Result.DefaultSelection<Prisma.$SymbolPayload>
/**
 * Model QuickStoryboardConfig
 * 
 */
export type QuickStoryboardConfig = $Result.DefaultSelection<Prisma.$QuickStoryboardConfigPayload>
/**
 * Model GenerationHistory
 * 
 */
export type GenerationHistory = $Result.DefaultSelection<Prisma.$GenerationHistoryPayload>
/**
 * Model ActionSymbol
 * 
 */
export type ActionSymbol = $Result.DefaultSelection<Prisma.$ActionSymbolPayload>
/**
 * Model ActionConfiguration
 * 
 */
export type ActionConfiguration = $Result.DefaultSelection<Prisma.$ActionConfigurationPayload>
/**
 * Model MultimediaAPIConfig
 * 
 */
export type MultimediaAPIConfig = $Result.DefaultSelection<Prisma.$MultimediaAPIConfigPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs>;

  /**
   * `prisma.symbol`: Exposes CRUD operations for the **Symbol** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Symbols
    * const symbols = await prisma.symbol.findMany()
    * ```
    */
  get symbol(): Prisma.SymbolDelegate<ExtArgs>;

  /**
   * `prisma.quickStoryboardConfig`: Exposes CRUD operations for the **QuickStoryboardConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuickStoryboardConfigs
    * const quickStoryboardConfigs = await prisma.quickStoryboardConfig.findMany()
    * ```
    */
  get quickStoryboardConfig(): Prisma.QuickStoryboardConfigDelegate<ExtArgs>;

  /**
   * `prisma.generationHistory`: Exposes CRUD operations for the **GenerationHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GenerationHistories
    * const generationHistories = await prisma.generationHistory.findMany()
    * ```
    */
  get generationHistory(): Prisma.GenerationHistoryDelegate<ExtArgs>;

  /**
   * `prisma.actionSymbol`: Exposes CRUD operations for the **ActionSymbol** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActionSymbols
    * const actionSymbols = await prisma.actionSymbol.findMany()
    * ```
    */
  get actionSymbol(): Prisma.ActionSymbolDelegate<ExtArgs>;

  /**
   * `prisma.actionConfiguration`: Exposes CRUD operations for the **ActionConfiguration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActionConfigurations
    * const actionConfigurations = await prisma.actionConfiguration.findMany()
    * ```
    */
  get actionConfiguration(): Prisma.ActionConfigurationDelegate<ExtArgs>;

  /**
   * `prisma.multimediaAPIConfig`: Exposes CRUD operations for the **MultimediaAPIConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MultimediaAPIConfigs
    * const multimediaAPIConfigs = await prisma.multimediaAPIConfig.findMany()
    * ```
    */
  get multimediaAPIConfig(): Prisma.MultimediaAPIConfigDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Transaction: 'Transaction',
    Symbol: 'Symbol',
    QuickStoryboardConfig: 'QuickStoryboardConfig',
    GenerationHistory: 'GenerationHistory',
    ActionSymbol: 'ActionSymbol',
    ActionConfiguration: 'ActionConfiguration',
    MultimediaAPIConfig: 'MultimediaAPIConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "transaction" | "symbol" | "quickStoryboardConfig" | "generationHistory" | "actionSymbol" | "actionConfiguration" | "multimediaAPIConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Symbol: {
        payload: Prisma.$SymbolPayload<ExtArgs>
        fields: Prisma.SymbolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SymbolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SymbolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          findFirst: {
            args: Prisma.SymbolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SymbolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          findMany: {
            args: Prisma.SymbolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>[]
          }
          create: {
            args: Prisma.SymbolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          createMany: {
            args: Prisma.SymbolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SymbolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>[]
          }
          delete: {
            args: Prisma.SymbolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          update: {
            args: Prisma.SymbolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          deleteMany: {
            args: Prisma.SymbolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SymbolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SymbolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SymbolPayload>
          }
          aggregate: {
            args: Prisma.SymbolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSymbol>
          }
          groupBy: {
            args: Prisma.SymbolGroupByArgs<ExtArgs>
            result: $Utils.Optional<SymbolGroupByOutputType>[]
          }
          count: {
            args: Prisma.SymbolCountArgs<ExtArgs>
            result: $Utils.Optional<SymbolCountAggregateOutputType> | number
          }
        }
      }
      QuickStoryboardConfig: {
        payload: Prisma.$QuickStoryboardConfigPayload<ExtArgs>
        fields: Prisma.QuickStoryboardConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuickStoryboardConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuickStoryboardConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>
          }
          findFirst: {
            args: Prisma.QuickStoryboardConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuickStoryboardConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>
          }
          findMany: {
            args: Prisma.QuickStoryboardConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>[]
          }
          create: {
            args: Prisma.QuickStoryboardConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>
          }
          createMany: {
            args: Prisma.QuickStoryboardConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuickStoryboardConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>[]
          }
          delete: {
            args: Prisma.QuickStoryboardConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>
          }
          update: {
            args: Prisma.QuickStoryboardConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>
          }
          deleteMany: {
            args: Prisma.QuickStoryboardConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuickStoryboardConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuickStoryboardConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuickStoryboardConfigPayload>
          }
          aggregate: {
            args: Prisma.QuickStoryboardConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuickStoryboardConfig>
          }
          groupBy: {
            args: Prisma.QuickStoryboardConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuickStoryboardConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuickStoryboardConfigCountArgs<ExtArgs>
            result: $Utils.Optional<QuickStoryboardConfigCountAggregateOutputType> | number
          }
        }
      }
      GenerationHistory: {
        payload: Prisma.$GenerationHistoryPayload<ExtArgs>
        fields: Prisma.GenerationHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GenerationHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GenerationHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>
          }
          findFirst: {
            args: Prisma.GenerationHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GenerationHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>
          }
          findMany: {
            args: Prisma.GenerationHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>[]
          }
          create: {
            args: Prisma.GenerationHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>
          }
          createMany: {
            args: Prisma.GenerationHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GenerationHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>[]
          }
          delete: {
            args: Prisma.GenerationHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>
          }
          update: {
            args: Prisma.GenerationHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>
          }
          deleteMany: {
            args: Prisma.GenerationHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GenerationHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GenerationHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GenerationHistoryPayload>
          }
          aggregate: {
            args: Prisma.GenerationHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGenerationHistory>
          }
          groupBy: {
            args: Prisma.GenerationHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<GenerationHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.GenerationHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<GenerationHistoryCountAggregateOutputType> | number
          }
        }
      }
      ActionSymbol: {
        payload: Prisma.$ActionSymbolPayload<ExtArgs>
        fields: Prisma.ActionSymbolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActionSymbolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActionSymbolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>
          }
          findFirst: {
            args: Prisma.ActionSymbolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActionSymbolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>
          }
          findMany: {
            args: Prisma.ActionSymbolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>[]
          }
          create: {
            args: Prisma.ActionSymbolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>
          }
          createMany: {
            args: Prisma.ActionSymbolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActionSymbolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>[]
          }
          delete: {
            args: Prisma.ActionSymbolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>
          }
          update: {
            args: Prisma.ActionSymbolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>
          }
          deleteMany: {
            args: Prisma.ActionSymbolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActionSymbolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActionSymbolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionSymbolPayload>
          }
          aggregate: {
            args: Prisma.ActionSymbolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActionSymbol>
          }
          groupBy: {
            args: Prisma.ActionSymbolGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActionSymbolGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActionSymbolCountArgs<ExtArgs>
            result: $Utils.Optional<ActionSymbolCountAggregateOutputType> | number
          }
        }
      }
      ActionConfiguration: {
        payload: Prisma.$ActionConfigurationPayload<ExtArgs>
        fields: Prisma.ActionConfigurationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActionConfigurationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActionConfigurationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>
          }
          findFirst: {
            args: Prisma.ActionConfigurationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActionConfigurationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>
          }
          findMany: {
            args: Prisma.ActionConfigurationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>[]
          }
          create: {
            args: Prisma.ActionConfigurationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>
          }
          createMany: {
            args: Prisma.ActionConfigurationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActionConfigurationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>[]
          }
          delete: {
            args: Prisma.ActionConfigurationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>
          }
          update: {
            args: Prisma.ActionConfigurationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>
          }
          deleteMany: {
            args: Prisma.ActionConfigurationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActionConfigurationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ActionConfigurationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionConfigurationPayload>
          }
          aggregate: {
            args: Prisma.ActionConfigurationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActionConfiguration>
          }
          groupBy: {
            args: Prisma.ActionConfigurationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActionConfigurationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActionConfigurationCountArgs<ExtArgs>
            result: $Utils.Optional<ActionConfigurationCountAggregateOutputType> | number
          }
        }
      }
      MultimediaAPIConfig: {
        payload: Prisma.$MultimediaAPIConfigPayload<ExtArgs>
        fields: Prisma.MultimediaAPIConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MultimediaAPIConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MultimediaAPIConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>
          }
          findFirst: {
            args: Prisma.MultimediaAPIConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MultimediaAPIConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>
          }
          findMany: {
            args: Prisma.MultimediaAPIConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>[]
          }
          create: {
            args: Prisma.MultimediaAPIConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>
          }
          createMany: {
            args: Prisma.MultimediaAPIConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MultimediaAPIConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>[]
          }
          delete: {
            args: Prisma.MultimediaAPIConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>
          }
          update: {
            args: Prisma.MultimediaAPIConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>
          }
          deleteMany: {
            args: Prisma.MultimediaAPIConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MultimediaAPIConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MultimediaAPIConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MultimediaAPIConfigPayload>
          }
          aggregate: {
            args: Prisma.MultimediaAPIConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMultimediaAPIConfig>
          }
          groupBy: {
            args: Prisma.MultimediaAPIConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<MultimediaAPIConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.MultimediaAPIConfigCountArgs<ExtArgs>
            result: $Utils.Optional<MultimediaAPIConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    transactions: number
    symbols: number
    quickStoryboardConfigs: number
    generationHistory: number
    actionSymbols: number
    actionConfigurations: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs
    symbols?: boolean | UserCountOutputTypeCountSymbolsArgs
    quickStoryboardConfigs?: boolean | UserCountOutputTypeCountQuickStoryboardConfigsArgs
    generationHistory?: boolean | UserCountOutputTypeCountGenerationHistoryArgs
    actionSymbols?: boolean | UserCountOutputTypeCountActionSymbolsArgs
    actionConfigurations?: boolean | UserCountOutputTypeCountActionConfigurationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSymbolsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SymbolWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountQuickStoryboardConfigsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuickStoryboardConfigWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGenerationHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GenerationHistoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActionSymbolsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionSymbolWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActionConfigurationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionConfigurationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    balance: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    balance: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    username: string | null
    email: string | null
    password: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    username: string | null
    email: string | null
    password: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    email: number
    password: number
    balance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    balance?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    balance?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    username: string
    email: string
    password: string
    balance: number
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    symbols?: boolean | User$symbolsArgs<ExtArgs>
    quickStoryboardConfigs?: boolean | User$quickStoryboardConfigsArgs<ExtArgs>
    generationHistory?: boolean | User$generationHistoryArgs<ExtArgs>
    actionSymbols?: boolean | User$actionSymbolsArgs<ExtArgs>
    actionConfigurations?: boolean | User$actionConfigurationsArgs<ExtArgs>
    multimediaAPIConfig?: boolean | User$multimediaAPIConfigArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    symbols?: boolean | User$symbolsArgs<ExtArgs>
    quickStoryboardConfigs?: boolean | User$quickStoryboardConfigsArgs<ExtArgs>
    generationHistory?: boolean | User$generationHistoryArgs<ExtArgs>
    actionSymbols?: boolean | User$actionSymbolsArgs<ExtArgs>
    actionConfigurations?: boolean | User$actionConfigurationsArgs<ExtArgs>
    multimediaAPIConfig?: boolean | User$multimediaAPIConfigArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      symbols: Prisma.$SymbolPayload<ExtArgs>[]
      quickStoryboardConfigs: Prisma.$QuickStoryboardConfigPayload<ExtArgs>[]
      generationHistory: Prisma.$GenerationHistoryPayload<ExtArgs>[]
      actionSymbols: Prisma.$ActionSymbolPayload<ExtArgs>[]
      actionConfigurations: Prisma.$ActionConfigurationPayload<ExtArgs>[]
      multimediaAPIConfig: Prisma.$MultimediaAPIConfigPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      email: string
      password: string
      balance: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactions<T extends User$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany"> | Null>
    symbols<T extends User$symbolsArgs<ExtArgs> = {}>(args?: Subset<T, User$symbolsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findMany"> | Null>
    quickStoryboardConfigs<T extends User$quickStoryboardConfigsArgs<ExtArgs> = {}>(args?: Subset<T, User$quickStoryboardConfigsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "findMany"> | Null>
    generationHistory<T extends User$generationHistoryArgs<ExtArgs> = {}>(args?: Subset<T, User$generationHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    actionSymbols<T extends User$actionSymbolsArgs<ExtArgs> = {}>(args?: Subset<T, User$actionSymbolsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "findMany"> | Null>
    actionConfigurations<T extends User$actionConfigurationsArgs<ExtArgs> = {}>(args?: Subset<T, User$actionConfigurationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "findMany"> | Null>
    multimediaAPIConfig<T extends User$multimediaAPIConfigArgs<ExtArgs> = {}>(args?: Subset<T, User$multimediaAPIConfigArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly balance: FieldRef<"User", 'Float'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.transactions
   */
  export type User$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.symbols
   */
  export type User$symbolsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    where?: SymbolWhereInput
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    cursor?: SymbolWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SymbolScalarFieldEnum | SymbolScalarFieldEnum[]
  }

  /**
   * User.quickStoryboardConfigs
   */
  export type User$quickStoryboardConfigsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    where?: QuickStoryboardConfigWhereInput
    orderBy?: QuickStoryboardConfigOrderByWithRelationInput | QuickStoryboardConfigOrderByWithRelationInput[]
    cursor?: QuickStoryboardConfigWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuickStoryboardConfigScalarFieldEnum | QuickStoryboardConfigScalarFieldEnum[]
  }

  /**
   * User.generationHistory
   */
  export type User$generationHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    where?: GenerationHistoryWhereInput
    orderBy?: GenerationHistoryOrderByWithRelationInput | GenerationHistoryOrderByWithRelationInput[]
    cursor?: GenerationHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GenerationHistoryScalarFieldEnum | GenerationHistoryScalarFieldEnum[]
  }

  /**
   * User.actionSymbols
   */
  export type User$actionSymbolsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    where?: ActionSymbolWhereInput
    orderBy?: ActionSymbolOrderByWithRelationInput | ActionSymbolOrderByWithRelationInput[]
    cursor?: ActionSymbolWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActionSymbolScalarFieldEnum | ActionSymbolScalarFieldEnum[]
  }

  /**
   * User.actionConfigurations
   */
  export type User$actionConfigurationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    where?: ActionConfigurationWhereInput
    orderBy?: ActionConfigurationOrderByWithRelationInput | ActionConfigurationOrderByWithRelationInput[]
    cursor?: ActionConfigurationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActionConfigurationScalarFieldEnum | ActionConfigurationScalarFieldEnum[]
  }

  /**
   * User.multimediaAPIConfig
   */
  export type User$multimediaAPIConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    where?: MultimediaAPIConfigWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    amount: number | null
  }

  export type TransactionSumAggregateOutputType = {
    id: number | null
    userId: number | null
    amount: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: number | null
    userId: number | null
    type: string | null
    amount: number | null
    description: string | null
    createdAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    type: string | null
    amount: number | null
    description: string | null
    createdAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    amount: number
    description: number
    createdAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
  }

  export type TransactionSumAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    amount?: true
    description?: true
    createdAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    amount?: true
    description?: true
    createdAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    amount?: true
    description?: true
    createdAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: number
    userId: number
    type: string
    amount: number
    description: string | null
    createdAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    createdAt?: boolean
  }

  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      type: string
      amount: number
      description: string | null
      createdAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */ 
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'Int'>
    readonly userId: FieldRef<"Transaction", 'Int'>
    readonly type: FieldRef<"Transaction", 'String'>
    readonly amount: FieldRef<"Transaction", 'Float'>
    readonly description: FieldRef<"Transaction", 'String'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Symbol
   */

  export type AggregateSymbol = {
    _count: SymbolCountAggregateOutputType | null
    _avg: SymbolAvgAggregateOutputType | null
    _sum: SymbolSumAggregateOutputType | null
    _min: SymbolMinAggregateOutputType | null
    _max: SymbolMaxAggregateOutputType | null
  }

  export type SymbolAvgAggregateOutputType = {
    userId: number | null
  }

  export type SymbolSumAggregateOutputType = {
    userId: number | null
  }

  export type SymbolMinAggregateOutputType = {
    id: string | null
    userId: number | null
    icon: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SymbolMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    icon: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SymbolCountAggregateOutputType = {
    id: number
    userId: number
    icon: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SymbolAvgAggregateInputType = {
    userId?: true
  }

  export type SymbolSumAggregateInputType = {
    userId?: true
  }

  export type SymbolMinAggregateInputType = {
    id?: true
    userId?: true
    icon?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SymbolMaxAggregateInputType = {
    id?: true
    userId?: true
    icon?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SymbolCountAggregateInputType = {
    id?: true
    userId?: true
    icon?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SymbolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Symbol to aggregate.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Symbols
    **/
    _count?: true | SymbolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SymbolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SymbolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SymbolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SymbolMaxAggregateInputType
  }

  export type GetSymbolAggregateType<T extends SymbolAggregateArgs> = {
        [P in keyof T & keyof AggregateSymbol]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSymbol[P]>
      : GetScalarType<T[P], AggregateSymbol[P]>
  }




  export type SymbolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SymbolWhereInput
    orderBy?: SymbolOrderByWithAggregationInput | SymbolOrderByWithAggregationInput[]
    by: SymbolScalarFieldEnum[] | SymbolScalarFieldEnum
    having?: SymbolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SymbolCountAggregateInputType | true
    _avg?: SymbolAvgAggregateInputType
    _sum?: SymbolSumAggregateInputType
    _min?: SymbolMinAggregateInputType
    _max?: SymbolMaxAggregateInputType
  }

  export type SymbolGroupByOutputType = {
    id: string
    userId: number
    icon: string
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    _count: SymbolCountAggregateOutputType | null
    _avg: SymbolAvgAggregateOutputType | null
    _sum: SymbolSumAggregateOutputType | null
    _min: SymbolMinAggregateOutputType | null
    _max: SymbolMaxAggregateOutputType | null
  }

  type GetSymbolGroupByPayload<T extends SymbolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SymbolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SymbolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SymbolGroupByOutputType[P]>
            : GetScalarType<T[P], SymbolGroupByOutputType[P]>
        }
      >
    >


  export type SymbolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    icon?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["symbol"]>

  export type SymbolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    icon?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["symbol"]>

  export type SymbolSelectScalar = {
    id?: boolean
    userId?: boolean
    icon?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SymbolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SymbolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SymbolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Symbol"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      icon: string
      name: string
      description: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["symbol"]>
    composites: {}
  }

  type SymbolGetPayload<S extends boolean | null | undefined | SymbolDefaultArgs> = $Result.GetResult<Prisma.$SymbolPayload, S>

  type SymbolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SymbolFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SymbolCountAggregateInputType | true
    }

  export interface SymbolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Symbol'], meta: { name: 'Symbol' } }
    /**
     * Find zero or one Symbol that matches the filter.
     * @param {SymbolFindUniqueArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SymbolFindUniqueArgs>(args: SelectSubset<T, SymbolFindUniqueArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Symbol that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SymbolFindUniqueOrThrowArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SymbolFindUniqueOrThrowArgs>(args: SelectSubset<T, SymbolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Symbol that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolFindFirstArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SymbolFindFirstArgs>(args?: SelectSubset<T, SymbolFindFirstArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Symbol that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolFindFirstOrThrowArgs} args - Arguments to find a Symbol
     * @example
     * // Get one Symbol
     * const symbol = await prisma.symbol.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SymbolFindFirstOrThrowArgs>(args?: SelectSubset<T, SymbolFindFirstOrThrowArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Symbols that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Symbols
     * const symbols = await prisma.symbol.findMany()
     * 
     * // Get first 10 Symbols
     * const symbols = await prisma.symbol.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const symbolWithIdOnly = await prisma.symbol.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SymbolFindManyArgs>(args?: SelectSubset<T, SymbolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Symbol.
     * @param {SymbolCreateArgs} args - Arguments to create a Symbol.
     * @example
     * // Create one Symbol
     * const Symbol = await prisma.symbol.create({
     *   data: {
     *     // ... data to create a Symbol
     *   }
     * })
     * 
     */
    create<T extends SymbolCreateArgs>(args: SelectSubset<T, SymbolCreateArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Symbols.
     * @param {SymbolCreateManyArgs} args - Arguments to create many Symbols.
     * @example
     * // Create many Symbols
     * const symbol = await prisma.symbol.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SymbolCreateManyArgs>(args?: SelectSubset<T, SymbolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Symbols and returns the data saved in the database.
     * @param {SymbolCreateManyAndReturnArgs} args - Arguments to create many Symbols.
     * @example
     * // Create many Symbols
     * const symbol = await prisma.symbol.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Symbols and only return the `id`
     * const symbolWithIdOnly = await prisma.symbol.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SymbolCreateManyAndReturnArgs>(args?: SelectSubset<T, SymbolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Symbol.
     * @param {SymbolDeleteArgs} args - Arguments to delete one Symbol.
     * @example
     * // Delete one Symbol
     * const Symbol = await prisma.symbol.delete({
     *   where: {
     *     // ... filter to delete one Symbol
     *   }
     * })
     * 
     */
    delete<T extends SymbolDeleteArgs>(args: SelectSubset<T, SymbolDeleteArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Symbol.
     * @param {SymbolUpdateArgs} args - Arguments to update one Symbol.
     * @example
     * // Update one Symbol
     * const symbol = await prisma.symbol.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SymbolUpdateArgs>(args: SelectSubset<T, SymbolUpdateArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Symbols.
     * @param {SymbolDeleteManyArgs} args - Arguments to filter Symbols to delete.
     * @example
     * // Delete a few Symbols
     * const { count } = await prisma.symbol.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SymbolDeleteManyArgs>(args?: SelectSubset<T, SymbolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Symbols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Symbols
     * const symbol = await prisma.symbol.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SymbolUpdateManyArgs>(args: SelectSubset<T, SymbolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Symbol.
     * @param {SymbolUpsertArgs} args - Arguments to update or create a Symbol.
     * @example
     * // Update or create a Symbol
     * const symbol = await prisma.symbol.upsert({
     *   create: {
     *     // ... data to create a Symbol
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Symbol we want to update
     *   }
     * })
     */
    upsert<T extends SymbolUpsertArgs>(args: SelectSubset<T, SymbolUpsertArgs<ExtArgs>>): Prisma__SymbolClient<$Result.GetResult<Prisma.$SymbolPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Symbols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolCountArgs} args - Arguments to filter Symbols to count.
     * @example
     * // Count the number of Symbols
     * const count = await prisma.symbol.count({
     *   where: {
     *     // ... the filter for the Symbols we want to count
     *   }
     * })
    **/
    count<T extends SymbolCountArgs>(
      args?: Subset<T, SymbolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SymbolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Symbol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SymbolAggregateArgs>(args: Subset<T, SymbolAggregateArgs>): Prisma.PrismaPromise<GetSymbolAggregateType<T>>

    /**
     * Group by Symbol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SymbolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SymbolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SymbolGroupByArgs['orderBy'] }
        : { orderBy?: SymbolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SymbolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSymbolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Symbol model
   */
  readonly fields: SymbolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Symbol.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SymbolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Symbol model
   */ 
  interface SymbolFieldRefs {
    readonly id: FieldRef<"Symbol", 'String'>
    readonly userId: FieldRef<"Symbol", 'Int'>
    readonly icon: FieldRef<"Symbol", 'String'>
    readonly name: FieldRef<"Symbol", 'String'>
    readonly description: FieldRef<"Symbol", 'String'>
    readonly createdAt: FieldRef<"Symbol", 'DateTime'>
    readonly updatedAt: FieldRef<"Symbol", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Symbol findUnique
   */
  export type SymbolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol findUniqueOrThrow
   */
  export type SymbolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol findFirst
   */
  export type SymbolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Symbols.
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Symbols.
     */
    distinct?: SymbolScalarFieldEnum | SymbolScalarFieldEnum[]
  }

  /**
   * Symbol findFirstOrThrow
   */
  export type SymbolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbol to fetch.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Symbols.
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Symbols.
     */
    distinct?: SymbolScalarFieldEnum | SymbolScalarFieldEnum[]
  }

  /**
   * Symbol findMany
   */
  export type SymbolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter, which Symbols to fetch.
     */
    where?: SymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Symbols to fetch.
     */
    orderBy?: SymbolOrderByWithRelationInput | SymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Symbols.
     */
    cursor?: SymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Symbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Symbols.
     */
    skip?: number
    distinct?: SymbolScalarFieldEnum | SymbolScalarFieldEnum[]
  }

  /**
   * Symbol create
   */
  export type SymbolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * The data needed to create a Symbol.
     */
    data: XOR<SymbolCreateInput, SymbolUncheckedCreateInput>
  }

  /**
   * Symbol createMany
   */
  export type SymbolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Symbols.
     */
    data: SymbolCreateManyInput | SymbolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Symbol createManyAndReturn
   */
  export type SymbolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Symbols.
     */
    data: SymbolCreateManyInput | SymbolCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Symbol update
   */
  export type SymbolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * The data needed to update a Symbol.
     */
    data: XOR<SymbolUpdateInput, SymbolUncheckedUpdateInput>
    /**
     * Choose, which Symbol to update.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol updateMany
   */
  export type SymbolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Symbols.
     */
    data: XOR<SymbolUpdateManyMutationInput, SymbolUncheckedUpdateManyInput>
    /**
     * Filter which Symbols to update
     */
    where?: SymbolWhereInput
  }

  /**
   * Symbol upsert
   */
  export type SymbolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * The filter to search for the Symbol to update in case it exists.
     */
    where: SymbolWhereUniqueInput
    /**
     * In case the Symbol found by the `where` argument doesn't exist, create a new Symbol with this data.
     */
    create: XOR<SymbolCreateInput, SymbolUncheckedCreateInput>
    /**
     * In case the Symbol was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SymbolUpdateInput, SymbolUncheckedUpdateInput>
  }

  /**
   * Symbol delete
   */
  export type SymbolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
    /**
     * Filter which Symbol to delete.
     */
    where: SymbolWhereUniqueInput
  }

  /**
   * Symbol deleteMany
   */
  export type SymbolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Symbols to delete
     */
    where?: SymbolWhereInput
  }

  /**
   * Symbol without action
   */
  export type SymbolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Symbol
     */
    select?: SymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SymbolInclude<ExtArgs> | null
  }


  /**
   * Model QuickStoryboardConfig
   */

  export type AggregateQuickStoryboardConfig = {
    _count: QuickStoryboardConfigCountAggregateOutputType | null
    _avg: QuickStoryboardConfigAvgAggregateOutputType | null
    _sum: QuickStoryboardConfigSumAggregateOutputType | null
    _min: QuickStoryboardConfigMinAggregateOutputType | null
    _max: QuickStoryboardConfigMaxAggregateOutputType | null
  }

  export type QuickStoryboardConfigAvgAggregateOutputType = {
    userId: number | null
  }

  export type QuickStoryboardConfigSumAggregateOutputType = {
    userId: number | null
  }

  export type QuickStoryboardConfigMinAggregateOutputType = {
    id: string | null
    userId: number | null
    name: string | null
    description: string | null
    threeViewTemplate: string | null
    multiGridTemplate: string | null
    styleComparisonTemplate: string | null
    narrativeProgressionTemplate: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuickStoryboardConfigMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    name: string | null
    description: string | null
    threeViewTemplate: string | null
    multiGridTemplate: string | null
    styleComparisonTemplate: string | null
    narrativeProgressionTemplate: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QuickStoryboardConfigCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    description: number
    threeViewTemplate: number
    multiGridTemplate: number
    styleComparisonTemplate: number
    narrativeProgressionTemplate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QuickStoryboardConfigAvgAggregateInputType = {
    userId?: true
  }

  export type QuickStoryboardConfigSumAggregateInputType = {
    userId?: true
  }

  export type QuickStoryboardConfigMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    threeViewTemplate?: true
    multiGridTemplate?: true
    styleComparisonTemplate?: true
    narrativeProgressionTemplate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuickStoryboardConfigMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    threeViewTemplate?: true
    multiGridTemplate?: true
    styleComparisonTemplate?: true
    narrativeProgressionTemplate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QuickStoryboardConfigCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    threeViewTemplate?: true
    multiGridTemplate?: true
    styleComparisonTemplate?: true
    narrativeProgressionTemplate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QuickStoryboardConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuickStoryboardConfig to aggregate.
     */
    where?: QuickStoryboardConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuickStoryboardConfigs to fetch.
     */
    orderBy?: QuickStoryboardConfigOrderByWithRelationInput | QuickStoryboardConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuickStoryboardConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuickStoryboardConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuickStoryboardConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuickStoryboardConfigs
    **/
    _count?: true | QuickStoryboardConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuickStoryboardConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuickStoryboardConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuickStoryboardConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuickStoryboardConfigMaxAggregateInputType
  }

  export type GetQuickStoryboardConfigAggregateType<T extends QuickStoryboardConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateQuickStoryboardConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuickStoryboardConfig[P]>
      : GetScalarType<T[P], AggregateQuickStoryboardConfig[P]>
  }




  export type QuickStoryboardConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuickStoryboardConfigWhereInput
    orderBy?: QuickStoryboardConfigOrderByWithAggregationInput | QuickStoryboardConfigOrderByWithAggregationInput[]
    by: QuickStoryboardConfigScalarFieldEnum[] | QuickStoryboardConfigScalarFieldEnum
    having?: QuickStoryboardConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuickStoryboardConfigCountAggregateInputType | true
    _avg?: QuickStoryboardConfigAvgAggregateInputType
    _sum?: QuickStoryboardConfigSumAggregateInputType
    _min?: QuickStoryboardConfigMinAggregateInputType
    _max?: QuickStoryboardConfigMaxAggregateInputType
  }

  export type QuickStoryboardConfigGroupByOutputType = {
    id: string
    userId: number
    name: string
    description: string
    threeViewTemplate: string
    multiGridTemplate: string
    styleComparisonTemplate: string
    narrativeProgressionTemplate: string
    createdAt: Date
    updatedAt: Date
    _count: QuickStoryboardConfigCountAggregateOutputType | null
    _avg: QuickStoryboardConfigAvgAggregateOutputType | null
    _sum: QuickStoryboardConfigSumAggregateOutputType | null
    _min: QuickStoryboardConfigMinAggregateOutputType | null
    _max: QuickStoryboardConfigMaxAggregateOutputType | null
  }

  type GetQuickStoryboardConfigGroupByPayload<T extends QuickStoryboardConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuickStoryboardConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuickStoryboardConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuickStoryboardConfigGroupByOutputType[P]>
            : GetScalarType<T[P], QuickStoryboardConfigGroupByOutputType[P]>
        }
      >
    >


  export type QuickStoryboardConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    threeViewTemplate?: boolean
    multiGridTemplate?: boolean
    styleComparisonTemplate?: boolean
    narrativeProgressionTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quickStoryboardConfig"]>

  export type QuickStoryboardConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    threeViewTemplate?: boolean
    multiGridTemplate?: boolean
    styleComparisonTemplate?: boolean
    narrativeProgressionTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quickStoryboardConfig"]>

  export type QuickStoryboardConfigSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    threeViewTemplate?: boolean
    multiGridTemplate?: boolean
    styleComparisonTemplate?: boolean
    narrativeProgressionTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QuickStoryboardConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type QuickStoryboardConfigIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $QuickStoryboardConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuickStoryboardConfig"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      name: string
      description: string
      threeViewTemplate: string
      multiGridTemplate: string
      styleComparisonTemplate: string
      narrativeProgressionTemplate: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["quickStoryboardConfig"]>
    composites: {}
  }

  type QuickStoryboardConfigGetPayload<S extends boolean | null | undefined | QuickStoryboardConfigDefaultArgs> = $Result.GetResult<Prisma.$QuickStoryboardConfigPayload, S>

  type QuickStoryboardConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuickStoryboardConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuickStoryboardConfigCountAggregateInputType | true
    }

  export interface QuickStoryboardConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuickStoryboardConfig'], meta: { name: 'QuickStoryboardConfig' } }
    /**
     * Find zero or one QuickStoryboardConfig that matches the filter.
     * @param {QuickStoryboardConfigFindUniqueArgs} args - Arguments to find a QuickStoryboardConfig
     * @example
     * // Get one QuickStoryboardConfig
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuickStoryboardConfigFindUniqueArgs>(args: SelectSubset<T, QuickStoryboardConfigFindUniqueArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QuickStoryboardConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuickStoryboardConfigFindUniqueOrThrowArgs} args - Arguments to find a QuickStoryboardConfig
     * @example
     * // Get one QuickStoryboardConfig
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuickStoryboardConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, QuickStoryboardConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QuickStoryboardConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuickStoryboardConfigFindFirstArgs} args - Arguments to find a QuickStoryboardConfig
     * @example
     * // Get one QuickStoryboardConfig
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuickStoryboardConfigFindFirstArgs>(args?: SelectSubset<T, QuickStoryboardConfigFindFirstArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QuickStoryboardConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuickStoryboardConfigFindFirstOrThrowArgs} args - Arguments to find a QuickStoryboardConfig
     * @example
     * // Get one QuickStoryboardConfig
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuickStoryboardConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, QuickStoryboardConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QuickStoryboardConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuickStoryboardConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuickStoryboardConfigs
     * const quickStoryboardConfigs = await prisma.quickStoryboardConfig.findMany()
     * 
     * // Get first 10 QuickStoryboardConfigs
     * const quickStoryboardConfigs = await prisma.quickStoryboardConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quickStoryboardConfigWithIdOnly = await prisma.quickStoryboardConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuickStoryboardConfigFindManyArgs>(args?: SelectSubset<T, QuickStoryboardConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QuickStoryboardConfig.
     * @param {QuickStoryboardConfigCreateArgs} args - Arguments to create a QuickStoryboardConfig.
     * @example
     * // Create one QuickStoryboardConfig
     * const QuickStoryboardConfig = await prisma.quickStoryboardConfig.create({
     *   data: {
     *     // ... data to create a QuickStoryboardConfig
     *   }
     * })
     * 
     */
    create<T extends QuickStoryboardConfigCreateArgs>(args: SelectSubset<T, QuickStoryboardConfigCreateArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QuickStoryboardConfigs.
     * @param {QuickStoryboardConfigCreateManyArgs} args - Arguments to create many QuickStoryboardConfigs.
     * @example
     * // Create many QuickStoryboardConfigs
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuickStoryboardConfigCreateManyArgs>(args?: SelectSubset<T, QuickStoryboardConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuickStoryboardConfigs and returns the data saved in the database.
     * @param {QuickStoryboardConfigCreateManyAndReturnArgs} args - Arguments to create many QuickStoryboardConfigs.
     * @example
     * // Create many QuickStoryboardConfigs
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuickStoryboardConfigs and only return the `id`
     * const quickStoryboardConfigWithIdOnly = await prisma.quickStoryboardConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuickStoryboardConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, QuickStoryboardConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QuickStoryboardConfig.
     * @param {QuickStoryboardConfigDeleteArgs} args - Arguments to delete one QuickStoryboardConfig.
     * @example
     * // Delete one QuickStoryboardConfig
     * const QuickStoryboardConfig = await prisma.quickStoryboardConfig.delete({
     *   where: {
     *     // ... filter to delete one QuickStoryboardConfig
     *   }
     * })
     * 
     */
    delete<T extends QuickStoryboardConfigDeleteArgs>(args: SelectSubset<T, QuickStoryboardConfigDeleteArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QuickStoryboardConfig.
     * @param {QuickStoryboardConfigUpdateArgs} args - Arguments to update one QuickStoryboardConfig.
     * @example
     * // Update one QuickStoryboardConfig
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuickStoryboardConfigUpdateArgs>(args: SelectSubset<T, QuickStoryboardConfigUpdateArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QuickStoryboardConfigs.
     * @param {QuickStoryboardConfigDeleteManyArgs} args - Arguments to filter QuickStoryboardConfigs to delete.
     * @example
     * // Delete a few QuickStoryboardConfigs
     * const { count } = await prisma.quickStoryboardConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuickStoryboardConfigDeleteManyArgs>(args?: SelectSubset<T, QuickStoryboardConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuickStoryboardConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuickStoryboardConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuickStoryboardConfigs
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuickStoryboardConfigUpdateManyArgs>(args: SelectSubset<T, QuickStoryboardConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QuickStoryboardConfig.
     * @param {QuickStoryboardConfigUpsertArgs} args - Arguments to update or create a QuickStoryboardConfig.
     * @example
     * // Update or create a QuickStoryboardConfig
     * const quickStoryboardConfig = await prisma.quickStoryboardConfig.upsert({
     *   create: {
     *     // ... data to create a QuickStoryboardConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuickStoryboardConfig we want to update
     *   }
     * })
     */
    upsert<T extends QuickStoryboardConfigUpsertArgs>(args: SelectSubset<T, QuickStoryboardConfigUpsertArgs<ExtArgs>>): Prisma__QuickStoryboardConfigClient<$Result.GetResult<Prisma.$QuickStoryboardConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QuickStoryboardConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuickStoryboardConfigCountArgs} args - Arguments to filter QuickStoryboardConfigs to count.
     * @example
     * // Count the number of QuickStoryboardConfigs
     * const count = await prisma.quickStoryboardConfig.count({
     *   where: {
     *     // ... the filter for the QuickStoryboardConfigs we want to count
     *   }
     * })
    **/
    count<T extends QuickStoryboardConfigCountArgs>(
      args?: Subset<T, QuickStoryboardConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuickStoryboardConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuickStoryboardConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuickStoryboardConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuickStoryboardConfigAggregateArgs>(args: Subset<T, QuickStoryboardConfigAggregateArgs>): Prisma.PrismaPromise<GetQuickStoryboardConfigAggregateType<T>>

    /**
     * Group by QuickStoryboardConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuickStoryboardConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuickStoryboardConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuickStoryboardConfigGroupByArgs['orderBy'] }
        : { orderBy?: QuickStoryboardConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuickStoryboardConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuickStoryboardConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuickStoryboardConfig model
   */
  readonly fields: QuickStoryboardConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuickStoryboardConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuickStoryboardConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QuickStoryboardConfig model
   */ 
  interface QuickStoryboardConfigFieldRefs {
    readonly id: FieldRef<"QuickStoryboardConfig", 'String'>
    readonly userId: FieldRef<"QuickStoryboardConfig", 'Int'>
    readonly name: FieldRef<"QuickStoryboardConfig", 'String'>
    readonly description: FieldRef<"QuickStoryboardConfig", 'String'>
    readonly threeViewTemplate: FieldRef<"QuickStoryboardConfig", 'String'>
    readonly multiGridTemplate: FieldRef<"QuickStoryboardConfig", 'String'>
    readonly styleComparisonTemplate: FieldRef<"QuickStoryboardConfig", 'String'>
    readonly narrativeProgressionTemplate: FieldRef<"QuickStoryboardConfig", 'String'>
    readonly createdAt: FieldRef<"QuickStoryboardConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"QuickStoryboardConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QuickStoryboardConfig findUnique
   */
  export type QuickStoryboardConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * Filter, which QuickStoryboardConfig to fetch.
     */
    where: QuickStoryboardConfigWhereUniqueInput
  }

  /**
   * QuickStoryboardConfig findUniqueOrThrow
   */
  export type QuickStoryboardConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * Filter, which QuickStoryboardConfig to fetch.
     */
    where: QuickStoryboardConfigWhereUniqueInput
  }

  /**
   * QuickStoryboardConfig findFirst
   */
  export type QuickStoryboardConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * Filter, which QuickStoryboardConfig to fetch.
     */
    where?: QuickStoryboardConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuickStoryboardConfigs to fetch.
     */
    orderBy?: QuickStoryboardConfigOrderByWithRelationInput | QuickStoryboardConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuickStoryboardConfigs.
     */
    cursor?: QuickStoryboardConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuickStoryboardConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuickStoryboardConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuickStoryboardConfigs.
     */
    distinct?: QuickStoryboardConfigScalarFieldEnum | QuickStoryboardConfigScalarFieldEnum[]
  }

  /**
   * QuickStoryboardConfig findFirstOrThrow
   */
  export type QuickStoryboardConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * Filter, which QuickStoryboardConfig to fetch.
     */
    where?: QuickStoryboardConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuickStoryboardConfigs to fetch.
     */
    orderBy?: QuickStoryboardConfigOrderByWithRelationInput | QuickStoryboardConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuickStoryboardConfigs.
     */
    cursor?: QuickStoryboardConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuickStoryboardConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuickStoryboardConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuickStoryboardConfigs.
     */
    distinct?: QuickStoryboardConfigScalarFieldEnum | QuickStoryboardConfigScalarFieldEnum[]
  }

  /**
   * QuickStoryboardConfig findMany
   */
  export type QuickStoryboardConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * Filter, which QuickStoryboardConfigs to fetch.
     */
    where?: QuickStoryboardConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuickStoryboardConfigs to fetch.
     */
    orderBy?: QuickStoryboardConfigOrderByWithRelationInput | QuickStoryboardConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuickStoryboardConfigs.
     */
    cursor?: QuickStoryboardConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuickStoryboardConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuickStoryboardConfigs.
     */
    skip?: number
    distinct?: QuickStoryboardConfigScalarFieldEnum | QuickStoryboardConfigScalarFieldEnum[]
  }

  /**
   * QuickStoryboardConfig create
   */
  export type QuickStoryboardConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a QuickStoryboardConfig.
     */
    data: XOR<QuickStoryboardConfigCreateInput, QuickStoryboardConfigUncheckedCreateInput>
  }

  /**
   * QuickStoryboardConfig createMany
   */
  export type QuickStoryboardConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuickStoryboardConfigs.
     */
    data: QuickStoryboardConfigCreateManyInput | QuickStoryboardConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuickStoryboardConfig createManyAndReturn
   */
  export type QuickStoryboardConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QuickStoryboardConfigs.
     */
    data: QuickStoryboardConfigCreateManyInput | QuickStoryboardConfigCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuickStoryboardConfig update
   */
  export type QuickStoryboardConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a QuickStoryboardConfig.
     */
    data: XOR<QuickStoryboardConfigUpdateInput, QuickStoryboardConfigUncheckedUpdateInput>
    /**
     * Choose, which QuickStoryboardConfig to update.
     */
    where: QuickStoryboardConfigWhereUniqueInput
  }

  /**
   * QuickStoryboardConfig updateMany
   */
  export type QuickStoryboardConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuickStoryboardConfigs.
     */
    data: XOR<QuickStoryboardConfigUpdateManyMutationInput, QuickStoryboardConfigUncheckedUpdateManyInput>
    /**
     * Filter which QuickStoryboardConfigs to update
     */
    where?: QuickStoryboardConfigWhereInput
  }

  /**
   * QuickStoryboardConfig upsert
   */
  export type QuickStoryboardConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the QuickStoryboardConfig to update in case it exists.
     */
    where: QuickStoryboardConfigWhereUniqueInput
    /**
     * In case the QuickStoryboardConfig found by the `where` argument doesn't exist, create a new QuickStoryboardConfig with this data.
     */
    create: XOR<QuickStoryboardConfigCreateInput, QuickStoryboardConfigUncheckedCreateInput>
    /**
     * In case the QuickStoryboardConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuickStoryboardConfigUpdateInput, QuickStoryboardConfigUncheckedUpdateInput>
  }

  /**
   * QuickStoryboardConfig delete
   */
  export type QuickStoryboardConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
    /**
     * Filter which QuickStoryboardConfig to delete.
     */
    where: QuickStoryboardConfigWhereUniqueInput
  }

  /**
   * QuickStoryboardConfig deleteMany
   */
  export type QuickStoryboardConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuickStoryboardConfigs to delete
     */
    where?: QuickStoryboardConfigWhereInput
  }

  /**
   * QuickStoryboardConfig without action
   */
  export type QuickStoryboardConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuickStoryboardConfig
     */
    select?: QuickStoryboardConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuickStoryboardConfigInclude<ExtArgs> | null
  }


  /**
   * Model GenerationHistory
   */

  export type AggregateGenerationHistory = {
    _count: GenerationHistoryCountAggregateOutputType | null
    _avg: GenerationHistoryAvgAggregateOutputType | null
    _sum: GenerationHistorySumAggregateOutputType | null
    _min: GenerationHistoryMinAggregateOutputType | null
    _max: GenerationHistoryMaxAggregateOutputType | null
  }

  export type GenerationHistoryAvgAggregateOutputType = {
    userId: number | null
  }

  export type GenerationHistorySumAggregateOutputType = {
    userId: number | null
  }

  export type GenerationHistoryMinAggregateOutputType = {
    id: string | null
    userId: number | null
    type: string | null
    prompt: string | null
    createdAt: Date | null
  }

  export type GenerationHistoryMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    type: string | null
    prompt: string | null
    createdAt: Date | null
  }

  export type GenerationHistoryCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    prompt: number
    images: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type GenerationHistoryAvgAggregateInputType = {
    userId?: true
  }

  export type GenerationHistorySumAggregateInputType = {
    userId?: true
  }

  export type GenerationHistoryMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    prompt?: true
    createdAt?: true
  }

  export type GenerationHistoryMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    prompt?: true
    createdAt?: true
  }

  export type GenerationHistoryCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    prompt?: true
    images?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type GenerationHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GenerationHistory to aggregate.
     */
    where?: GenerationHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationHistories to fetch.
     */
    orderBy?: GenerationHistoryOrderByWithRelationInput | GenerationHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GenerationHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GenerationHistories
    **/
    _count?: true | GenerationHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GenerationHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GenerationHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GenerationHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GenerationHistoryMaxAggregateInputType
  }

  export type GetGenerationHistoryAggregateType<T extends GenerationHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateGenerationHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGenerationHistory[P]>
      : GetScalarType<T[P], AggregateGenerationHistory[P]>
  }




  export type GenerationHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GenerationHistoryWhereInput
    orderBy?: GenerationHistoryOrderByWithAggregationInput | GenerationHistoryOrderByWithAggregationInput[]
    by: GenerationHistoryScalarFieldEnum[] | GenerationHistoryScalarFieldEnum
    having?: GenerationHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GenerationHistoryCountAggregateInputType | true
    _avg?: GenerationHistoryAvgAggregateInputType
    _sum?: GenerationHistorySumAggregateInputType
    _min?: GenerationHistoryMinAggregateInputType
    _max?: GenerationHistoryMaxAggregateInputType
  }

  export type GenerationHistoryGroupByOutputType = {
    id: string
    userId: number
    type: string
    prompt: string
    images: string[]
    metadata: JsonValue
    createdAt: Date
    _count: GenerationHistoryCountAggregateOutputType | null
    _avg: GenerationHistoryAvgAggregateOutputType | null
    _sum: GenerationHistorySumAggregateOutputType | null
    _min: GenerationHistoryMinAggregateOutputType | null
    _max: GenerationHistoryMaxAggregateOutputType | null
  }

  type GetGenerationHistoryGroupByPayload<T extends GenerationHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GenerationHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GenerationHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GenerationHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], GenerationHistoryGroupByOutputType[P]>
        }
      >
    >


  export type GenerationHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    prompt?: boolean
    images?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generationHistory"]>

  export type GenerationHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    prompt?: boolean
    images?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generationHistory"]>

  export type GenerationHistorySelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    prompt?: boolean
    images?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type GenerationHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GenerationHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $GenerationHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GenerationHistory"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      type: string
      prompt: string
      images: string[]
      metadata: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["generationHistory"]>
    composites: {}
  }

  type GenerationHistoryGetPayload<S extends boolean | null | undefined | GenerationHistoryDefaultArgs> = $Result.GetResult<Prisma.$GenerationHistoryPayload, S>

  type GenerationHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GenerationHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GenerationHistoryCountAggregateInputType | true
    }

  export interface GenerationHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GenerationHistory'], meta: { name: 'GenerationHistory' } }
    /**
     * Find zero or one GenerationHistory that matches the filter.
     * @param {GenerationHistoryFindUniqueArgs} args - Arguments to find a GenerationHistory
     * @example
     * // Get one GenerationHistory
     * const generationHistory = await prisma.generationHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GenerationHistoryFindUniqueArgs>(args: SelectSubset<T, GenerationHistoryFindUniqueArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GenerationHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GenerationHistoryFindUniqueOrThrowArgs} args - Arguments to find a GenerationHistory
     * @example
     * // Get one GenerationHistory
     * const generationHistory = await prisma.generationHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GenerationHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, GenerationHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GenerationHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationHistoryFindFirstArgs} args - Arguments to find a GenerationHistory
     * @example
     * // Get one GenerationHistory
     * const generationHistory = await prisma.generationHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GenerationHistoryFindFirstArgs>(args?: SelectSubset<T, GenerationHistoryFindFirstArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GenerationHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationHistoryFindFirstOrThrowArgs} args - Arguments to find a GenerationHistory
     * @example
     * // Get one GenerationHistory
     * const generationHistory = await prisma.generationHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GenerationHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, GenerationHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GenerationHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GenerationHistories
     * const generationHistories = await prisma.generationHistory.findMany()
     * 
     * // Get first 10 GenerationHistories
     * const generationHistories = await prisma.generationHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const generationHistoryWithIdOnly = await prisma.generationHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GenerationHistoryFindManyArgs>(args?: SelectSubset<T, GenerationHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GenerationHistory.
     * @param {GenerationHistoryCreateArgs} args - Arguments to create a GenerationHistory.
     * @example
     * // Create one GenerationHistory
     * const GenerationHistory = await prisma.generationHistory.create({
     *   data: {
     *     // ... data to create a GenerationHistory
     *   }
     * })
     * 
     */
    create<T extends GenerationHistoryCreateArgs>(args: SelectSubset<T, GenerationHistoryCreateArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GenerationHistories.
     * @param {GenerationHistoryCreateManyArgs} args - Arguments to create many GenerationHistories.
     * @example
     * // Create many GenerationHistories
     * const generationHistory = await prisma.generationHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GenerationHistoryCreateManyArgs>(args?: SelectSubset<T, GenerationHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GenerationHistories and returns the data saved in the database.
     * @param {GenerationHistoryCreateManyAndReturnArgs} args - Arguments to create many GenerationHistories.
     * @example
     * // Create many GenerationHistories
     * const generationHistory = await prisma.generationHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GenerationHistories and only return the `id`
     * const generationHistoryWithIdOnly = await prisma.generationHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GenerationHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, GenerationHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GenerationHistory.
     * @param {GenerationHistoryDeleteArgs} args - Arguments to delete one GenerationHistory.
     * @example
     * // Delete one GenerationHistory
     * const GenerationHistory = await prisma.generationHistory.delete({
     *   where: {
     *     // ... filter to delete one GenerationHistory
     *   }
     * })
     * 
     */
    delete<T extends GenerationHistoryDeleteArgs>(args: SelectSubset<T, GenerationHistoryDeleteArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GenerationHistory.
     * @param {GenerationHistoryUpdateArgs} args - Arguments to update one GenerationHistory.
     * @example
     * // Update one GenerationHistory
     * const generationHistory = await prisma.generationHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GenerationHistoryUpdateArgs>(args: SelectSubset<T, GenerationHistoryUpdateArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GenerationHistories.
     * @param {GenerationHistoryDeleteManyArgs} args - Arguments to filter GenerationHistories to delete.
     * @example
     * // Delete a few GenerationHistories
     * const { count } = await prisma.generationHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GenerationHistoryDeleteManyArgs>(args?: SelectSubset<T, GenerationHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GenerationHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GenerationHistories
     * const generationHistory = await prisma.generationHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GenerationHistoryUpdateManyArgs>(args: SelectSubset<T, GenerationHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GenerationHistory.
     * @param {GenerationHistoryUpsertArgs} args - Arguments to update or create a GenerationHistory.
     * @example
     * // Update or create a GenerationHistory
     * const generationHistory = await prisma.generationHistory.upsert({
     *   create: {
     *     // ... data to create a GenerationHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GenerationHistory we want to update
     *   }
     * })
     */
    upsert<T extends GenerationHistoryUpsertArgs>(args: SelectSubset<T, GenerationHistoryUpsertArgs<ExtArgs>>): Prisma__GenerationHistoryClient<$Result.GetResult<Prisma.$GenerationHistoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GenerationHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationHistoryCountArgs} args - Arguments to filter GenerationHistories to count.
     * @example
     * // Count the number of GenerationHistories
     * const count = await prisma.generationHistory.count({
     *   where: {
     *     // ... the filter for the GenerationHistories we want to count
     *   }
     * })
    **/
    count<T extends GenerationHistoryCountArgs>(
      args?: Subset<T, GenerationHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GenerationHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GenerationHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GenerationHistoryAggregateArgs>(args: Subset<T, GenerationHistoryAggregateArgs>): Prisma.PrismaPromise<GetGenerationHistoryAggregateType<T>>

    /**
     * Group by GenerationHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GenerationHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GenerationHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GenerationHistoryGroupByArgs['orderBy'] }
        : { orderBy?: GenerationHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GenerationHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGenerationHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GenerationHistory model
   */
  readonly fields: GenerationHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GenerationHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GenerationHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GenerationHistory model
   */ 
  interface GenerationHistoryFieldRefs {
    readonly id: FieldRef<"GenerationHistory", 'String'>
    readonly userId: FieldRef<"GenerationHistory", 'Int'>
    readonly type: FieldRef<"GenerationHistory", 'String'>
    readonly prompt: FieldRef<"GenerationHistory", 'String'>
    readonly images: FieldRef<"GenerationHistory", 'String[]'>
    readonly metadata: FieldRef<"GenerationHistory", 'Json'>
    readonly createdAt: FieldRef<"GenerationHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GenerationHistory findUnique
   */
  export type GenerationHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GenerationHistory to fetch.
     */
    where: GenerationHistoryWhereUniqueInput
  }

  /**
   * GenerationHistory findUniqueOrThrow
   */
  export type GenerationHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GenerationHistory to fetch.
     */
    where: GenerationHistoryWhereUniqueInput
  }

  /**
   * GenerationHistory findFirst
   */
  export type GenerationHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GenerationHistory to fetch.
     */
    where?: GenerationHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationHistories to fetch.
     */
    orderBy?: GenerationHistoryOrderByWithRelationInput | GenerationHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GenerationHistories.
     */
    cursor?: GenerationHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GenerationHistories.
     */
    distinct?: GenerationHistoryScalarFieldEnum | GenerationHistoryScalarFieldEnum[]
  }

  /**
   * GenerationHistory findFirstOrThrow
   */
  export type GenerationHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GenerationHistory to fetch.
     */
    where?: GenerationHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationHistories to fetch.
     */
    orderBy?: GenerationHistoryOrderByWithRelationInput | GenerationHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GenerationHistories.
     */
    cursor?: GenerationHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GenerationHistories.
     */
    distinct?: GenerationHistoryScalarFieldEnum | GenerationHistoryScalarFieldEnum[]
  }

  /**
   * GenerationHistory findMany
   */
  export type GenerationHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GenerationHistories to fetch.
     */
    where?: GenerationHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GenerationHistories to fetch.
     */
    orderBy?: GenerationHistoryOrderByWithRelationInput | GenerationHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GenerationHistories.
     */
    cursor?: GenerationHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GenerationHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GenerationHistories.
     */
    skip?: number
    distinct?: GenerationHistoryScalarFieldEnum | GenerationHistoryScalarFieldEnum[]
  }

  /**
   * GenerationHistory create
   */
  export type GenerationHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a GenerationHistory.
     */
    data: XOR<GenerationHistoryCreateInput, GenerationHistoryUncheckedCreateInput>
  }

  /**
   * GenerationHistory createMany
   */
  export type GenerationHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GenerationHistories.
     */
    data: GenerationHistoryCreateManyInput | GenerationHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GenerationHistory createManyAndReturn
   */
  export type GenerationHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GenerationHistories.
     */
    data: GenerationHistoryCreateManyInput | GenerationHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GenerationHistory update
   */
  export type GenerationHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a GenerationHistory.
     */
    data: XOR<GenerationHistoryUpdateInput, GenerationHistoryUncheckedUpdateInput>
    /**
     * Choose, which GenerationHistory to update.
     */
    where: GenerationHistoryWhereUniqueInput
  }

  /**
   * GenerationHistory updateMany
   */
  export type GenerationHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GenerationHistories.
     */
    data: XOR<GenerationHistoryUpdateManyMutationInput, GenerationHistoryUncheckedUpdateManyInput>
    /**
     * Filter which GenerationHistories to update
     */
    where?: GenerationHistoryWhereInput
  }

  /**
   * GenerationHistory upsert
   */
  export type GenerationHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the GenerationHistory to update in case it exists.
     */
    where: GenerationHistoryWhereUniqueInput
    /**
     * In case the GenerationHistory found by the `where` argument doesn't exist, create a new GenerationHistory with this data.
     */
    create: XOR<GenerationHistoryCreateInput, GenerationHistoryUncheckedCreateInput>
    /**
     * In case the GenerationHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GenerationHistoryUpdateInput, GenerationHistoryUncheckedUpdateInput>
  }

  /**
   * GenerationHistory delete
   */
  export type GenerationHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
    /**
     * Filter which GenerationHistory to delete.
     */
    where: GenerationHistoryWhereUniqueInput
  }

  /**
   * GenerationHistory deleteMany
   */
  export type GenerationHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GenerationHistories to delete
     */
    where?: GenerationHistoryWhereInput
  }

  /**
   * GenerationHistory without action
   */
  export type GenerationHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GenerationHistory
     */
    select?: GenerationHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GenerationHistoryInclude<ExtArgs> | null
  }


  /**
   * Model ActionSymbol
   */

  export type AggregateActionSymbol = {
    _count: ActionSymbolCountAggregateOutputType | null
    _avg: ActionSymbolAvgAggregateOutputType | null
    _sum: ActionSymbolSumAggregateOutputType | null
    _min: ActionSymbolMinAggregateOutputType | null
    _max: ActionSymbolMaxAggregateOutputType | null
  }

  export type ActionSymbolAvgAggregateOutputType = {
    userId: number | null
  }

  export type ActionSymbolSumAggregateOutputType = {
    userId: number | null
  }

  export type ActionSymbolMinAggregateOutputType = {
    id: string | null
    userId: number | null
    name: string | null
    icon: string | null
    description: string | null
    prompt: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActionSymbolMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    name: string | null
    icon: string | null
    description: string | null
    prompt: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActionSymbolCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    icon: number
    description: number
    prompt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ActionSymbolAvgAggregateInputType = {
    userId?: true
  }

  export type ActionSymbolSumAggregateInputType = {
    userId?: true
  }

  export type ActionSymbolMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    icon?: true
    description?: true
    prompt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActionSymbolMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    icon?: true
    description?: true
    prompt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActionSymbolCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    icon?: true
    description?: true
    prompt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ActionSymbolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionSymbol to aggregate.
     */
    where?: ActionSymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionSymbols to fetch.
     */
    orderBy?: ActionSymbolOrderByWithRelationInput | ActionSymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActionSymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionSymbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionSymbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActionSymbols
    **/
    _count?: true | ActionSymbolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ActionSymbolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ActionSymbolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActionSymbolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActionSymbolMaxAggregateInputType
  }

  export type GetActionSymbolAggregateType<T extends ActionSymbolAggregateArgs> = {
        [P in keyof T & keyof AggregateActionSymbol]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActionSymbol[P]>
      : GetScalarType<T[P], AggregateActionSymbol[P]>
  }




  export type ActionSymbolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionSymbolWhereInput
    orderBy?: ActionSymbolOrderByWithAggregationInput | ActionSymbolOrderByWithAggregationInput[]
    by: ActionSymbolScalarFieldEnum[] | ActionSymbolScalarFieldEnum
    having?: ActionSymbolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActionSymbolCountAggregateInputType | true
    _avg?: ActionSymbolAvgAggregateInputType
    _sum?: ActionSymbolSumAggregateInputType
    _min?: ActionSymbolMinAggregateInputType
    _max?: ActionSymbolMaxAggregateInputType
  }

  export type ActionSymbolGroupByOutputType = {
    id: string
    userId: number
    name: string
    icon: string
    description: string
    prompt: string
    createdAt: Date
    updatedAt: Date
    _count: ActionSymbolCountAggregateOutputType | null
    _avg: ActionSymbolAvgAggregateOutputType | null
    _sum: ActionSymbolSumAggregateOutputType | null
    _min: ActionSymbolMinAggregateOutputType | null
    _max: ActionSymbolMaxAggregateOutputType | null
  }

  type GetActionSymbolGroupByPayload<T extends ActionSymbolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActionSymbolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActionSymbolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActionSymbolGroupByOutputType[P]>
            : GetScalarType<T[P], ActionSymbolGroupByOutputType[P]>
        }
      >
    >


  export type ActionSymbolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    prompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["actionSymbol"]>

  export type ActionSymbolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    prompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["actionSymbol"]>

  export type ActionSymbolSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    icon?: boolean
    description?: boolean
    prompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ActionSymbolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ActionSymbolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ActionSymbolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActionSymbol"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      name: string
      icon: string
      description: string
      prompt: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["actionSymbol"]>
    composites: {}
  }

  type ActionSymbolGetPayload<S extends boolean | null | undefined | ActionSymbolDefaultArgs> = $Result.GetResult<Prisma.$ActionSymbolPayload, S>

  type ActionSymbolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActionSymbolFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActionSymbolCountAggregateInputType | true
    }

  export interface ActionSymbolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActionSymbol'], meta: { name: 'ActionSymbol' } }
    /**
     * Find zero or one ActionSymbol that matches the filter.
     * @param {ActionSymbolFindUniqueArgs} args - Arguments to find a ActionSymbol
     * @example
     * // Get one ActionSymbol
     * const actionSymbol = await prisma.actionSymbol.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActionSymbolFindUniqueArgs>(args: SelectSubset<T, ActionSymbolFindUniqueArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActionSymbol that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActionSymbolFindUniqueOrThrowArgs} args - Arguments to find a ActionSymbol
     * @example
     * // Get one ActionSymbol
     * const actionSymbol = await prisma.actionSymbol.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActionSymbolFindUniqueOrThrowArgs>(args: SelectSubset<T, ActionSymbolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActionSymbol that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionSymbolFindFirstArgs} args - Arguments to find a ActionSymbol
     * @example
     * // Get one ActionSymbol
     * const actionSymbol = await prisma.actionSymbol.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActionSymbolFindFirstArgs>(args?: SelectSubset<T, ActionSymbolFindFirstArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActionSymbol that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionSymbolFindFirstOrThrowArgs} args - Arguments to find a ActionSymbol
     * @example
     * // Get one ActionSymbol
     * const actionSymbol = await prisma.actionSymbol.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActionSymbolFindFirstOrThrowArgs>(args?: SelectSubset<T, ActionSymbolFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActionSymbols that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionSymbolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActionSymbols
     * const actionSymbols = await prisma.actionSymbol.findMany()
     * 
     * // Get first 10 ActionSymbols
     * const actionSymbols = await prisma.actionSymbol.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const actionSymbolWithIdOnly = await prisma.actionSymbol.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActionSymbolFindManyArgs>(args?: SelectSubset<T, ActionSymbolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActionSymbol.
     * @param {ActionSymbolCreateArgs} args - Arguments to create a ActionSymbol.
     * @example
     * // Create one ActionSymbol
     * const ActionSymbol = await prisma.actionSymbol.create({
     *   data: {
     *     // ... data to create a ActionSymbol
     *   }
     * })
     * 
     */
    create<T extends ActionSymbolCreateArgs>(args: SelectSubset<T, ActionSymbolCreateArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActionSymbols.
     * @param {ActionSymbolCreateManyArgs} args - Arguments to create many ActionSymbols.
     * @example
     * // Create many ActionSymbols
     * const actionSymbol = await prisma.actionSymbol.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActionSymbolCreateManyArgs>(args?: SelectSubset<T, ActionSymbolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActionSymbols and returns the data saved in the database.
     * @param {ActionSymbolCreateManyAndReturnArgs} args - Arguments to create many ActionSymbols.
     * @example
     * // Create many ActionSymbols
     * const actionSymbol = await prisma.actionSymbol.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActionSymbols and only return the `id`
     * const actionSymbolWithIdOnly = await prisma.actionSymbol.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActionSymbolCreateManyAndReturnArgs>(args?: SelectSubset<T, ActionSymbolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActionSymbol.
     * @param {ActionSymbolDeleteArgs} args - Arguments to delete one ActionSymbol.
     * @example
     * // Delete one ActionSymbol
     * const ActionSymbol = await prisma.actionSymbol.delete({
     *   where: {
     *     // ... filter to delete one ActionSymbol
     *   }
     * })
     * 
     */
    delete<T extends ActionSymbolDeleteArgs>(args: SelectSubset<T, ActionSymbolDeleteArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActionSymbol.
     * @param {ActionSymbolUpdateArgs} args - Arguments to update one ActionSymbol.
     * @example
     * // Update one ActionSymbol
     * const actionSymbol = await prisma.actionSymbol.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActionSymbolUpdateArgs>(args: SelectSubset<T, ActionSymbolUpdateArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActionSymbols.
     * @param {ActionSymbolDeleteManyArgs} args - Arguments to filter ActionSymbols to delete.
     * @example
     * // Delete a few ActionSymbols
     * const { count } = await prisma.actionSymbol.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActionSymbolDeleteManyArgs>(args?: SelectSubset<T, ActionSymbolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionSymbols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionSymbolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActionSymbols
     * const actionSymbol = await prisma.actionSymbol.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActionSymbolUpdateManyArgs>(args: SelectSubset<T, ActionSymbolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActionSymbol.
     * @param {ActionSymbolUpsertArgs} args - Arguments to update or create a ActionSymbol.
     * @example
     * // Update or create a ActionSymbol
     * const actionSymbol = await prisma.actionSymbol.upsert({
     *   create: {
     *     // ... data to create a ActionSymbol
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActionSymbol we want to update
     *   }
     * })
     */
    upsert<T extends ActionSymbolUpsertArgs>(args: SelectSubset<T, ActionSymbolUpsertArgs<ExtArgs>>): Prisma__ActionSymbolClient<$Result.GetResult<Prisma.$ActionSymbolPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActionSymbols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionSymbolCountArgs} args - Arguments to filter ActionSymbols to count.
     * @example
     * // Count the number of ActionSymbols
     * const count = await prisma.actionSymbol.count({
     *   where: {
     *     // ... the filter for the ActionSymbols we want to count
     *   }
     * })
    **/
    count<T extends ActionSymbolCountArgs>(
      args?: Subset<T, ActionSymbolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActionSymbolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActionSymbol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionSymbolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActionSymbolAggregateArgs>(args: Subset<T, ActionSymbolAggregateArgs>): Prisma.PrismaPromise<GetActionSymbolAggregateType<T>>

    /**
     * Group by ActionSymbol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionSymbolGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActionSymbolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActionSymbolGroupByArgs['orderBy'] }
        : { orderBy?: ActionSymbolGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActionSymbolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActionSymbolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActionSymbol model
   */
  readonly fields: ActionSymbolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActionSymbol.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActionSymbolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActionSymbol model
   */ 
  interface ActionSymbolFieldRefs {
    readonly id: FieldRef<"ActionSymbol", 'String'>
    readonly userId: FieldRef<"ActionSymbol", 'Int'>
    readonly name: FieldRef<"ActionSymbol", 'String'>
    readonly icon: FieldRef<"ActionSymbol", 'String'>
    readonly description: FieldRef<"ActionSymbol", 'String'>
    readonly prompt: FieldRef<"ActionSymbol", 'String'>
    readonly createdAt: FieldRef<"ActionSymbol", 'DateTime'>
    readonly updatedAt: FieldRef<"ActionSymbol", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActionSymbol findUnique
   */
  export type ActionSymbolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * Filter, which ActionSymbol to fetch.
     */
    where: ActionSymbolWhereUniqueInput
  }

  /**
   * ActionSymbol findUniqueOrThrow
   */
  export type ActionSymbolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * Filter, which ActionSymbol to fetch.
     */
    where: ActionSymbolWhereUniqueInput
  }

  /**
   * ActionSymbol findFirst
   */
  export type ActionSymbolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * Filter, which ActionSymbol to fetch.
     */
    where?: ActionSymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionSymbols to fetch.
     */
    orderBy?: ActionSymbolOrderByWithRelationInput | ActionSymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionSymbols.
     */
    cursor?: ActionSymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionSymbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionSymbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionSymbols.
     */
    distinct?: ActionSymbolScalarFieldEnum | ActionSymbolScalarFieldEnum[]
  }

  /**
   * ActionSymbol findFirstOrThrow
   */
  export type ActionSymbolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * Filter, which ActionSymbol to fetch.
     */
    where?: ActionSymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionSymbols to fetch.
     */
    orderBy?: ActionSymbolOrderByWithRelationInput | ActionSymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionSymbols.
     */
    cursor?: ActionSymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionSymbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionSymbols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionSymbols.
     */
    distinct?: ActionSymbolScalarFieldEnum | ActionSymbolScalarFieldEnum[]
  }

  /**
   * ActionSymbol findMany
   */
  export type ActionSymbolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * Filter, which ActionSymbols to fetch.
     */
    where?: ActionSymbolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionSymbols to fetch.
     */
    orderBy?: ActionSymbolOrderByWithRelationInput | ActionSymbolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActionSymbols.
     */
    cursor?: ActionSymbolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionSymbols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionSymbols.
     */
    skip?: number
    distinct?: ActionSymbolScalarFieldEnum | ActionSymbolScalarFieldEnum[]
  }

  /**
   * ActionSymbol create
   */
  export type ActionSymbolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * The data needed to create a ActionSymbol.
     */
    data: XOR<ActionSymbolCreateInput, ActionSymbolUncheckedCreateInput>
  }

  /**
   * ActionSymbol createMany
   */
  export type ActionSymbolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActionSymbols.
     */
    data: ActionSymbolCreateManyInput | ActionSymbolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionSymbol createManyAndReturn
   */
  export type ActionSymbolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActionSymbols.
     */
    data: ActionSymbolCreateManyInput | ActionSymbolCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActionSymbol update
   */
  export type ActionSymbolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * The data needed to update a ActionSymbol.
     */
    data: XOR<ActionSymbolUpdateInput, ActionSymbolUncheckedUpdateInput>
    /**
     * Choose, which ActionSymbol to update.
     */
    where: ActionSymbolWhereUniqueInput
  }

  /**
   * ActionSymbol updateMany
   */
  export type ActionSymbolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActionSymbols.
     */
    data: XOR<ActionSymbolUpdateManyMutationInput, ActionSymbolUncheckedUpdateManyInput>
    /**
     * Filter which ActionSymbols to update
     */
    where?: ActionSymbolWhereInput
  }

  /**
   * ActionSymbol upsert
   */
  export type ActionSymbolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * The filter to search for the ActionSymbol to update in case it exists.
     */
    where: ActionSymbolWhereUniqueInput
    /**
     * In case the ActionSymbol found by the `where` argument doesn't exist, create a new ActionSymbol with this data.
     */
    create: XOR<ActionSymbolCreateInput, ActionSymbolUncheckedCreateInput>
    /**
     * In case the ActionSymbol was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActionSymbolUpdateInput, ActionSymbolUncheckedUpdateInput>
  }

  /**
   * ActionSymbol delete
   */
  export type ActionSymbolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
    /**
     * Filter which ActionSymbol to delete.
     */
    where: ActionSymbolWhereUniqueInput
  }

  /**
   * ActionSymbol deleteMany
   */
  export type ActionSymbolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionSymbols to delete
     */
    where?: ActionSymbolWhereInput
  }

  /**
   * ActionSymbol without action
   */
  export type ActionSymbolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionSymbol
     */
    select?: ActionSymbolSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionSymbolInclude<ExtArgs> | null
  }


  /**
   * Model ActionConfiguration
   */

  export type AggregateActionConfiguration = {
    _count: ActionConfigurationCountAggregateOutputType | null
    _avg: ActionConfigurationAvgAggregateOutputType | null
    _sum: ActionConfigurationSumAggregateOutputType | null
    _min: ActionConfigurationMinAggregateOutputType | null
    _max: ActionConfigurationMaxAggregateOutputType | null
  }

  export type ActionConfigurationAvgAggregateOutputType = {
    userId: number | null
  }

  export type ActionConfigurationSumAggregateOutputType = {
    userId: number | null
  }

  export type ActionConfigurationMinAggregateOutputType = {
    id: string | null
    userId: number | null
    name: string | null
    description: string | null
    forwardTemplate: string | null
    rotateTemplate: string | null
    jumpTemplate: string | null
    flyTemplate: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActionConfigurationMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    name: string | null
    description: string | null
    forwardTemplate: string | null
    rotateTemplate: string | null
    jumpTemplate: string | null
    flyTemplate: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActionConfigurationCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    description: number
    forwardTemplate: number
    rotateTemplate: number
    jumpTemplate: number
    flyTemplate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ActionConfigurationAvgAggregateInputType = {
    userId?: true
  }

  export type ActionConfigurationSumAggregateInputType = {
    userId?: true
  }

  export type ActionConfigurationMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    forwardTemplate?: true
    rotateTemplate?: true
    jumpTemplate?: true
    flyTemplate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActionConfigurationMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    forwardTemplate?: true
    rotateTemplate?: true
    jumpTemplate?: true
    flyTemplate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActionConfigurationCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    description?: true
    forwardTemplate?: true
    rotateTemplate?: true
    jumpTemplate?: true
    flyTemplate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ActionConfigurationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionConfiguration to aggregate.
     */
    where?: ActionConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionConfigurations to fetch.
     */
    orderBy?: ActionConfigurationOrderByWithRelationInput | ActionConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActionConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActionConfigurations
    **/
    _count?: true | ActionConfigurationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ActionConfigurationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ActionConfigurationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActionConfigurationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActionConfigurationMaxAggregateInputType
  }

  export type GetActionConfigurationAggregateType<T extends ActionConfigurationAggregateArgs> = {
        [P in keyof T & keyof AggregateActionConfiguration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActionConfiguration[P]>
      : GetScalarType<T[P], AggregateActionConfiguration[P]>
  }




  export type ActionConfigurationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionConfigurationWhereInput
    orderBy?: ActionConfigurationOrderByWithAggregationInput | ActionConfigurationOrderByWithAggregationInput[]
    by: ActionConfigurationScalarFieldEnum[] | ActionConfigurationScalarFieldEnum
    having?: ActionConfigurationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActionConfigurationCountAggregateInputType | true
    _avg?: ActionConfigurationAvgAggregateInputType
    _sum?: ActionConfigurationSumAggregateInputType
    _min?: ActionConfigurationMinAggregateInputType
    _max?: ActionConfigurationMaxAggregateInputType
  }

  export type ActionConfigurationGroupByOutputType = {
    id: string
    userId: number
    name: string
    description: string
    forwardTemplate: string
    rotateTemplate: string
    jumpTemplate: string
    flyTemplate: string
    createdAt: Date
    updatedAt: Date
    _count: ActionConfigurationCountAggregateOutputType | null
    _avg: ActionConfigurationAvgAggregateOutputType | null
    _sum: ActionConfigurationSumAggregateOutputType | null
    _min: ActionConfigurationMinAggregateOutputType | null
    _max: ActionConfigurationMaxAggregateOutputType | null
  }

  type GetActionConfigurationGroupByPayload<T extends ActionConfigurationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActionConfigurationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActionConfigurationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActionConfigurationGroupByOutputType[P]>
            : GetScalarType<T[P], ActionConfigurationGroupByOutputType[P]>
        }
      >
    >


  export type ActionConfigurationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    forwardTemplate?: boolean
    rotateTemplate?: boolean
    jumpTemplate?: boolean
    flyTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["actionConfiguration"]>

  export type ActionConfigurationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    forwardTemplate?: boolean
    rotateTemplate?: boolean
    jumpTemplate?: boolean
    flyTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["actionConfiguration"]>

  export type ActionConfigurationSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    description?: boolean
    forwardTemplate?: boolean
    rotateTemplate?: boolean
    jumpTemplate?: boolean
    flyTemplate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ActionConfigurationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ActionConfigurationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ActionConfigurationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActionConfiguration"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      name: string
      description: string
      forwardTemplate: string
      rotateTemplate: string
      jumpTemplate: string
      flyTemplate: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["actionConfiguration"]>
    composites: {}
  }

  type ActionConfigurationGetPayload<S extends boolean | null | undefined | ActionConfigurationDefaultArgs> = $Result.GetResult<Prisma.$ActionConfigurationPayload, S>

  type ActionConfigurationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ActionConfigurationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ActionConfigurationCountAggregateInputType | true
    }

  export interface ActionConfigurationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActionConfiguration'], meta: { name: 'ActionConfiguration' } }
    /**
     * Find zero or one ActionConfiguration that matches the filter.
     * @param {ActionConfigurationFindUniqueArgs} args - Arguments to find a ActionConfiguration
     * @example
     * // Get one ActionConfiguration
     * const actionConfiguration = await prisma.actionConfiguration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActionConfigurationFindUniqueArgs>(args: SelectSubset<T, ActionConfigurationFindUniqueArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ActionConfiguration that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ActionConfigurationFindUniqueOrThrowArgs} args - Arguments to find a ActionConfiguration
     * @example
     * // Get one ActionConfiguration
     * const actionConfiguration = await prisma.actionConfiguration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActionConfigurationFindUniqueOrThrowArgs>(args: SelectSubset<T, ActionConfigurationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ActionConfiguration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionConfigurationFindFirstArgs} args - Arguments to find a ActionConfiguration
     * @example
     * // Get one ActionConfiguration
     * const actionConfiguration = await prisma.actionConfiguration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActionConfigurationFindFirstArgs>(args?: SelectSubset<T, ActionConfigurationFindFirstArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ActionConfiguration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionConfigurationFindFirstOrThrowArgs} args - Arguments to find a ActionConfiguration
     * @example
     * // Get one ActionConfiguration
     * const actionConfiguration = await prisma.actionConfiguration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActionConfigurationFindFirstOrThrowArgs>(args?: SelectSubset<T, ActionConfigurationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ActionConfigurations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionConfigurationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActionConfigurations
     * const actionConfigurations = await prisma.actionConfiguration.findMany()
     * 
     * // Get first 10 ActionConfigurations
     * const actionConfigurations = await prisma.actionConfiguration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const actionConfigurationWithIdOnly = await prisma.actionConfiguration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActionConfigurationFindManyArgs>(args?: SelectSubset<T, ActionConfigurationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ActionConfiguration.
     * @param {ActionConfigurationCreateArgs} args - Arguments to create a ActionConfiguration.
     * @example
     * // Create one ActionConfiguration
     * const ActionConfiguration = await prisma.actionConfiguration.create({
     *   data: {
     *     // ... data to create a ActionConfiguration
     *   }
     * })
     * 
     */
    create<T extends ActionConfigurationCreateArgs>(args: SelectSubset<T, ActionConfigurationCreateArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ActionConfigurations.
     * @param {ActionConfigurationCreateManyArgs} args - Arguments to create many ActionConfigurations.
     * @example
     * // Create many ActionConfigurations
     * const actionConfiguration = await prisma.actionConfiguration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActionConfigurationCreateManyArgs>(args?: SelectSubset<T, ActionConfigurationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActionConfigurations and returns the data saved in the database.
     * @param {ActionConfigurationCreateManyAndReturnArgs} args - Arguments to create many ActionConfigurations.
     * @example
     * // Create many ActionConfigurations
     * const actionConfiguration = await prisma.actionConfiguration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActionConfigurations and only return the `id`
     * const actionConfigurationWithIdOnly = await prisma.actionConfiguration.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActionConfigurationCreateManyAndReturnArgs>(args?: SelectSubset<T, ActionConfigurationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ActionConfiguration.
     * @param {ActionConfigurationDeleteArgs} args - Arguments to delete one ActionConfiguration.
     * @example
     * // Delete one ActionConfiguration
     * const ActionConfiguration = await prisma.actionConfiguration.delete({
     *   where: {
     *     // ... filter to delete one ActionConfiguration
     *   }
     * })
     * 
     */
    delete<T extends ActionConfigurationDeleteArgs>(args: SelectSubset<T, ActionConfigurationDeleteArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ActionConfiguration.
     * @param {ActionConfigurationUpdateArgs} args - Arguments to update one ActionConfiguration.
     * @example
     * // Update one ActionConfiguration
     * const actionConfiguration = await prisma.actionConfiguration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActionConfigurationUpdateArgs>(args: SelectSubset<T, ActionConfigurationUpdateArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ActionConfigurations.
     * @param {ActionConfigurationDeleteManyArgs} args - Arguments to filter ActionConfigurations to delete.
     * @example
     * // Delete a few ActionConfigurations
     * const { count } = await prisma.actionConfiguration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActionConfigurationDeleteManyArgs>(args?: SelectSubset<T, ActionConfigurationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionConfigurationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActionConfigurations
     * const actionConfiguration = await prisma.actionConfiguration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActionConfigurationUpdateManyArgs>(args: SelectSubset<T, ActionConfigurationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ActionConfiguration.
     * @param {ActionConfigurationUpsertArgs} args - Arguments to update or create a ActionConfiguration.
     * @example
     * // Update or create a ActionConfiguration
     * const actionConfiguration = await prisma.actionConfiguration.upsert({
     *   create: {
     *     // ... data to create a ActionConfiguration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActionConfiguration we want to update
     *   }
     * })
     */
    upsert<T extends ActionConfigurationUpsertArgs>(args: SelectSubset<T, ActionConfigurationUpsertArgs<ExtArgs>>): Prisma__ActionConfigurationClient<$Result.GetResult<Prisma.$ActionConfigurationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ActionConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionConfigurationCountArgs} args - Arguments to filter ActionConfigurations to count.
     * @example
     * // Count the number of ActionConfigurations
     * const count = await prisma.actionConfiguration.count({
     *   where: {
     *     // ... the filter for the ActionConfigurations we want to count
     *   }
     * })
    **/
    count<T extends ActionConfigurationCountArgs>(
      args?: Subset<T, ActionConfigurationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActionConfigurationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActionConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionConfigurationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActionConfigurationAggregateArgs>(args: Subset<T, ActionConfigurationAggregateArgs>): Prisma.PrismaPromise<GetActionConfigurationAggregateType<T>>

    /**
     * Group by ActionConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionConfigurationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ActionConfigurationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActionConfigurationGroupByArgs['orderBy'] }
        : { orderBy?: ActionConfigurationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ActionConfigurationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActionConfigurationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActionConfiguration model
   */
  readonly fields: ActionConfigurationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActionConfiguration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActionConfigurationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ActionConfiguration model
   */ 
  interface ActionConfigurationFieldRefs {
    readonly id: FieldRef<"ActionConfiguration", 'String'>
    readonly userId: FieldRef<"ActionConfiguration", 'Int'>
    readonly name: FieldRef<"ActionConfiguration", 'String'>
    readonly description: FieldRef<"ActionConfiguration", 'String'>
    readonly forwardTemplate: FieldRef<"ActionConfiguration", 'String'>
    readonly rotateTemplate: FieldRef<"ActionConfiguration", 'String'>
    readonly jumpTemplate: FieldRef<"ActionConfiguration", 'String'>
    readonly flyTemplate: FieldRef<"ActionConfiguration", 'String'>
    readonly createdAt: FieldRef<"ActionConfiguration", 'DateTime'>
    readonly updatedAt: FieldRef<"ActionConfiguration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActionConfiguration findUnique
   */
  export type ActionConfigurationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which ActionConfiguration to fetch.
     */
    where: ActionConfigurationWhereUniqueInput
  }

  /**
   * ActionConfiguration findUniqueOrThrow
   */
  export type ActionConfigurationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which ActionConfiguration to fetch.
     */
    where: ActionConfigurationWhereUniqueInput
  }

  /**
   * ActionConfiguration findFirst
   */
  export type ActionConfigurationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which ActionConfiguration to fetch.
     */
    where?: ActionConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionConfigurations to fetch.
     */
    orderBy?: ActionConfigurationOrderByWithRelationInput | ActionConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionConfigurations.
     */
    cursor?: ActionConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionConfigurations.
     */
    distinct?: ActionConfigurationScalarFieldEnum | ActionConfigurationScalarFieldEnum[]
  }

  /**
   * ActionConfiguration findFirstOrThrow
   */
  export type ActionConfigurationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which ActionConfiguration to fetch.
     */
    where?: ActionConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionConfigurations to fetch.
     */
    orderBy?: ActionConfigurationOrderByWithRelationInput | ActionConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionConfigurations.
     */
    cursor?: ActionConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionConfigurations.
     */
    distinct?: ActionConfigurationScalarFieldEnum | ActionConfigurationScalarFieldEnum[]
  }

  /**
   * ActionConfiguration findMany
   */
  export type ActionConfigurationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * Filter, which ActionConfigurations to fetch.
     */
    where?: ActionConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionConfigurations to fetch.
     */
    orderBy?: ActionConfigurationOrderByWithRelationInput | ActionConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActionConfigurations.
     */
    cursor?: ActionConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionConfigurations.
     */
    skip?: number
    distinct?: ActionConfigurationScalarFieldEnum | ActionConfigurationScalarFieldEnum[]
  }

  /**
   * ActionConfiguration create
   */
  export type ActionConfigurationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * The data needed to create a ActionConfiguration.
     */
    data: XOR<ActionConfigurationCreateInput, ActionConfigurationUncheckedCreateInput>
  }

  /**
   * ActionConfiguration createMany
   */
  export type ActionConfigurationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActionConfigurations.
     */
    data: ActionConfigurationCreateManyInput | ActionConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionConfiguration createManyAndReturn
   */
  export type ActionConfigurationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ActionConfigurations.
     */
    data: ActionConfigurationCreateManyInput | ActionConfigurationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActionConfiguration update
   */
  export type ActionConfigurationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * The data needed to update a ActionConfiguration.
     */
    data: XOR<ActionConfigurationUpdateInput, ActionConfigurationUncheckedUpdateInput>
    /**
     * Choose, which ActionConfiguration to update.
     */
    where: ActionConfigurationWhereUniqueInput
  }

  /**
   * ActionConfiguration updateMany
   */
  export type ActionConfigurationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActionConfigurations.
     */
    data: XOR<ActionConfigurationUpdateManyMutationInput, ActionConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which ActionConfigurations to update
     */
    where?: ActionConfigurationWhereInput
  }

  /**
   * ActionConfiguration upsert
   */
  export type ActionConfigurationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * The filter to search for the ActionConfiguration to update in case it exists.
     */
    where: ActionConfigurationWhereUniqueInput
    /**
     * In case the ActionConfiguration found by the `where` argument doesn't exist, create a new ActionConfiguration with this data.
     */
    create: XOR<ActionConfigurationCreateInput, ActionConfigurationUncheckedCreateInput>
    /**
     * In case the ActionConfiguration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActionConfigurationUpdateInput, ActionConfigurationUncheckedUpdateInput>
  }

  /**
   * ActionConfiguration delete
   */
  export type ActionConfigurationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
    /**
     * Filter which ActionConfiguration to delete.
     */
    where: ActionConfigurationWhereUniqueInput
  }

  /**
   * ActionConfiguration deleteMany
   */
  export type ActionConfigurationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionConfigurations to delete
     */
    where?: ActionConfigurationWhereInput
  }

  /**
   * ActionConfiguration without action
   */
  export type ActionConfigurationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionConfiguration
     */
    select?: ActionConfigurationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionConfigurationInclude<ExtArgs> | null
  }


  /**
   * Model MultimediaAPIConfig
   */

  export type AggregateMultimediaAPIConfig = {
    _count: MultimediaAPIConfigCountAggregateOutputType | null
    _avg: MultimediaAPIConfigAvgAggregateOutputType | null
    _sum: MultimediaAPIConfigSumAggregateOutputType | null
    _min: MultimediaAPIConfigMinAggregateOutputType | null
    _max: MultimediaAPIConfigMaxAggregateOutputType | null
  }

  export type MultimediaAPIConfigAvgAggregateOutputType = {
    userId: number | null
  }

  export type MultimediaAPIConfigSumAggregateOutputType = {
    userId: number | null
  }

  export type MultimediaAPIConfigMinAggregateOutputType = {
    id: string | null
    userId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MultimediaAPIConfigMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MultimediaAPIConfigCountAggregateOutputType = {
    id: number
    userId: number
    config: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MultimediaAPIConfigAvgAggregateInputType = {
    userId?: true
  }

  export type MultimediaAPIConfigSumAggregateInputType = {
    userId?: true
  }

  export type MultimediaAPIConfigMinAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MultimediaAPIConfigMaxAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MultimediaAPIConfigCountAggregateInputType = {
    id?: true
    userId?: true
    config?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MultimediaAPIConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MultimediaAPIConfig to aggregate.
     */
    where?: MultimediaAPIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MultimediaAPIConfigs to fetch.
     */
    orderBy?: MultimediaAPIConfigOrderByWithRelationInput | MultimediaAPIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MultimediaAPIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MultimediaAPIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MultimediaAPIConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MultimediaAPIConfigs
    **/
    _count?: true | MultimediaAPIConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MultimediaAPIConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MultimediaAPIConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MultimediaAPIConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MultimediaAPIConfigMaxAggregateInputType
  }

  export type GetMultimediaAPIConfigAggregateType<T extends MultimediaAPIConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateMultimediaAPIConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMultimediaAPIConfig[P]>
      : GetScalarType<T[P], AggregateMultimediaAPIConfig[P]>
  }




  export type MultimediaAPIConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MultimediaAPIConfigWhereInput
    orderBy?: MultimediaAPIConfigOrderByWithAggregationInput | MultimediaAPIConfigOrderByWithAggregationInput[]
    by: MultimediaAPIConfigScalarFieldEnum[] | MultimediaAPIConfigScalarFieldEnum
    having?: MultimediaAPIConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MultimediaAPIConfigCountAggregateInputType | true
    _avg?: MultimediaAPIConfigAvgAggregateInputType
    _sum?: MultimediaAPIConfigSumAggregateInputType
    _min?: MultimediaAPIConfigMinAggregateInputType
    _max?: MultimediaAPIConfigMaxAggregateInputType
  }

  export type MultimediaAPIConfigGroupByOutputType = {
    id: string
    userId: number
    config: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: MultimediaAPIConfigCountAggregateOutputType | null
    _avg: MultimediaAPIConfigAvgAggregateOutputType | null
    _sum: MultimediaAPIConfigSumAggregateOutputType | null
    _min: MultimediaAPIConfigMinAggregateOutputType | null
    _max: MultimediaAPIConfigMaxAggregateOutputType | null
  }

  type GetMultimediaAPIConfigGroupByPayload<T extends MultimediaAPIConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MultimediaAPIConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MultimediaAPIConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MultimediaAPIConfigGroupByOutputType[P]>
            : GetScalarType<T[P], MultimediaAPIConfigGroupByOutputType[P]>
        }
      >
    >


  export type MultimediaAPIConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["multimediaAPIConfig"]>

  export type MultimediaAPIConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["multimediaAPIConfig"]>

  export type MultimediaAPIConfigSelectScalar = {
    id?: boolean
    userId?: boolean
    config?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MultimediaAPIConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MultimediaAPIConfigIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MultimediaAPIConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MultimediaAPIConfig"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      config: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["multimediaAPIConfig"]>
    composites: {}
  }

  type MultimediaAPIConfigGetPayload<S extends boolean | null | undefined | MultimediaAPIConfigDefaultArgs> = $Result.GetResult<Prisma.$MultimediaAPIConfigPayload, S>

  type MultimediaAPIConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MultimediaAPIConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MultimediaAPIConfigCountAggregateInputType | true
    }

  export interface MultimediaAPIConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MultimediaAPIConfig'], meta: { name: 'MultimediaAPIConfig' } }
    /**
     * Find zero or one MultimediaAPIConfig that matches the filter.
     * @param {MultimediaAPIConfigFindUniqueArgs} args - Arguments to find a MultimediaAPIConfig
     * @example
     * // Get one MultimediaAPIConfig
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MultimediaAPIConfigFindUniqueArgs>(args: SelectSubset<T, MultimediaAPIConfigFindUniqueArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MultimediaAPIConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MultimediaAPIConfigFindUniqueOrThrowArgs} args - Arguments to find a MultimediaAPIConfig
     * @example
     * // Get one MultimediaAPIConfig
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MultimediaAPIConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, MultimediaAPIConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MultimediaAPIConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MultimediaAPIConfigFindFirstArgs} args - Arguments to find a MultimediaAPIConfig
     * @example
     * // Get one MultimediaAPIConfig
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MultimediaAPIConfigFindFirstArgs>(args?: SelectSubset<T, MultimediaAPIConfigFindFirstArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MultimediaAPIConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MultimediaAPIConfigFindFirstOrThrowArgs} args - Arguments to find a MultimediaAPIConfig
     * @example
     * // Get one MultimediaAPIConfig
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MultimediaAPIConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, MultimediaAPIConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MultimediaAPIConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MultimediaAPIConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MultimediaAPIConfigs
     * const multimediaAPIConfigs = await prisma.multimediaAPIConfig.findMany()
     * 
     * // Get first 10 MultimediaAPIConfigs
     * const multimediaAPIConfigs = await prisma.multimediaAPIConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const multimediaAPIConfigWithIdOnly = await prisma.multimediaAPIConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MultimediaAPIConfigFindManyArgs>(args?: SelectSubset<T, MultimediaAPIConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MultimediaAPIConfig.
     * @param {MultimediaAPIConfigCreateArgs} args - Arguments to create a MultimediaAPIConfig.
     * @example
     * // Create one MultimediaAPIConfig
     * const MultimediaAPIConfig = await prisma.multimediaAPIConfig.create({
     *   data: {
     *     // ... data to create a MultimediaAPIConfig
     *   }
     * })
     * 
     */
    create<T extends MultimediaAPIConfigCreateArgs>(args: SelectSubset<T, MultimediaAPIConfigCreateArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MultimediaAPIConfigs.
     * @param {MultimediaAPIConfigCreateManyArgs} args - Arguments to create many MultimediaAPIConfigs.
     * @example
     * // Create many MultimediaAPIConfigs
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MultimediaAPIConfigCreateManyArgs>(args?: SelectSubset<T, MultimediaAPIConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MultimediaAPIConfigs and returns the data saved in the database.
     * @param {MultimediaAPIConfigCreateManyAndReturnArgs} args - Arguments to create many MultimediaAPIConfigs.
     * @example
     * // Create many MultimediaAPIConfigs
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MultimediaAPIConfigs and only return the `id`
     * const multimediaAPIConfigWithIdOnly = await prisma.multimediaAPIConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MultimediaAPIConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, MultimediaAPIConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MultimediaAPIConfig.
     * @param {MultimediaAPIConfigDeleteArgs} args - Arguments to delete one MultimediaAPIConfig.
     * @example
     * // Delete one MultimediaAPIConfig
     * const MultimediaAPIConfig = await prisma.multimediaAPIConfig.delete({
     *   where: {
     *     // ... filter to delete one MultimediaAPIConfig
     *   }
     * })
     * 
     */
    delete<T extends MultimediaAPIConfigDeleteArgs>(args: SelectSubset<T, MultimediaAPIConfigDeleteArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MultimediaAPIConfig.
     * @param {MultimediaAPIConfigUpdateArgs} args - Arguments to update one MultimediaAPIConfig.
     * @example
     * // Update one MultimediaAPIConfig
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MultimediaAPIConfigUpdateArgs>(args: SelectSubset<T, MultimediaAPIConfigUpdateArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MultimediaAPIConfigs.
     * @param {MultimediaAPIConfigDeleteManyArgs} args - Arguments to filter MultimediaAPIConfigs to delete.
     * @example
     * // Delete a few MultimediaAPIConfigs
     * const { count } = await prisma.multimediaAPIConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MultimediaAPIConfigDeleteManyArgs>(args?: SelectSubset<T, MultimediaAPIConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MultimediaAPIConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MultimediaAPIConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MultimediaAPIConfigs
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MultimediaAPIConfigUpdateManyArgs>(args: SelectSubset<T, MultimediaAPIConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MultimediaAPIConfig.
     * @param {MultimediaAPIConfigUpsertArgs} args - Arguments to update or create a MultimediaAPIConfig.
     * @example
     * // Update or create a MultimediaAPIConfig
     * const multimediaAPIConfig = await prisma.multimediaAPIConfig.upsert({
     *   create: {
     *     // ... data to create a MultimediaAPIConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MultimediaAPIConfig we want to update
     *   }
     * })
     */
    upsert<T extends MultimediaAPIConfigUpsertArgs>(args: SelectSubset<T, MultimediaAPIConfigUpsertArgs<ExtArgs>>): Prisma__MultimediaAPIConfigClient<$Result.GetResult<Prisma.$MultimediaAPIConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MultimediaAPIConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MultimediaAPIConfigCountArgs} args - Arguments to filter MultimediaAPIConfigs to count.
     * @example
     * // Count the number of MultimediaAPIConfigs
     * const count = await prisma.multimediaAPIConfig.count({
     *   where: {
     *     // ... the filter for the MultimediaAPIConfigs we want to count
     *   }
     * })
    **/
    count<T extends MultimediaAPIConfigCountArgs>(
      args?: Subset<T, MultimediaAPIConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MultimediaAPIConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MultimediaAPIConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MultimediaAPIConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MultimediaAPIConfigAggregateArgs>(args: Subset<T, MultimediaAPIConfigAggregateArgs>): Prisma.PrismaPromise<GetMultimediaAPIConfigAggregateType<T>>

    /**
     * Group by MultimediaAPIConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MultimediaAPIConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MultimediaAPIConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MultimediaAPIConfigGroupByArgs['orderBy'] }
        : { orderBy?: MultimediaAPIConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MultimediaAPIConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMultimediaAPIConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MultimediaAPIConfig model
   */
  readonly fields: MultimediaAPIConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MultimediaAPIConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MultimediaAPIConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MultimediaAPIConfig model
   */ 
  interface MultimediaAPIConfigFieldRefs {
    readonly id: FieldRef<"MultimediaAPIConfig", 'String'>
    readonly userId: FieldRef<"MultimediaAPIConfig", 'Int'>
    readonly config: FieldRef<"MultimediaAPIConfig", 'Json'>
    readonly createdAt: FieldRef<"MultimediaAPIConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"MultimediaAPIConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MultimediaAPIConfig findUnique
   */
  export type MultimediaAPIConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * Filter, which MultimediaAPIConfig to fetch.
     */
    where: MultimediaAPIConfigWhereUniqueInput
  }

  /**
   * MultimediaAPIConfig findUniqueOrThrow
   */
  export type MultimediaAPIConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * Filter, which MultimediaAPIConfig to fetch.
     */
    where: MultimediaAPIConfigWhereUniqueInput
  }

  /**
   * MultimediaAPIConfig findFirst
   */
  export type MultimediaAPIConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * Filter, which MultimediaAPIConfig to fetch.
     */
    where?: MultimediaAPIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MultimediaAPIConfigs to fetch.
     */
    orderBy?: MultimediaAPIConfigOrderByWithRelationInput | MultimediaAPIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MultimediaAPIConfigs.
     */
    cursor?: MultimediaAPIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MultimediaAPIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MultimediaAPIConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MultimediaAPIConfigs.
     */
    distinct?: MultimediaAPIConfigScalarFieldEnum | MultimediaAPIConfigScalarFieldEnum[]
  }

  /**
   * MultimediaAPIConfig findFirstOrThrow
   */
  export type MultimediaAPIConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * Filter, which MultimediaAPIConfig to fetch.
     */
    where?: MultimediaAPIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MultimediaAPIConfigs to fetch.
     */
    orderBy?: MultimediaAPIConfigOrderByWithRelationInput | MultimediaAPIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MultimediaAPIConfigs.
     */
    cursor?: MultimediaAPIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MultimediaAPIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MultimediaAPIConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MultimediaAPIConfigs.
     */
    distinct?: MultimediaAPIConfigScalarFieldEnum | MultimediaAPIConfigScalarFieldEnum[]
  }

  /**
   * MultimediaAPIConfig findMany
   */
  export type MultimediaAPIConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * Filter, which MultimediaAPIConfigs to fetch.
     */
    where?: MultimediaAPIConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MultimediaAPIConfigs to fetch.
     */
    orderBy?: MultimediaAPIConfigOrderByWithRelationInput | MultimediaAPIConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MultimediaAPIConfigs.
     */
    cursor?: MultimediaAPIConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MultimediaAPIConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MultimediaAPIConfigs.
     */
    skip?: number
    distinct?: MultimediaAPIConfigScalarFieldEnum | MultimediaAPIConfigScalarFieldEnum[]
  }

  /**
   * MultimediaAPIConfig create
   */
  export type MultimediaAPIConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a MultimediaAPIConfig.
     */
    data: XOR<MultimediaAPIConfigCreateInput, MultimediaAPIConfigUncheckedCreateInput>
  }

  /**
   * MultimediaAPIConfig createMany
   */
  export type MultimediaAPIConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MultimediaAPIConfigs.
     */
    data: MultimediaAPIConfigCreateManyInput | MultimediaAPIConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MultimediaAPIConfig createManyAndReturn
   */
  export type MultimediaAPIConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MultimediaAPIConfigs.
     */
    data: MultimediaAPIConfigCreateManyInput | MultimediaAPIConfigCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MultimediaAPIConfig update
   */
  export type MultimediaAPIConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a MultimediaAPIConfig.
     */
    data: XOR<MultimediaAPIConfigUpdateInput, MultimediaAPIConfigUncheckedUpdateInput>
    /**
     * Choose, which MultimediaAPIConfig to update.
     */
    where: MultimediaAPIConfigWhereUniqueInput
  }

  /**
   * MultimediaAPIConfig updateMany
   */
  export type MultimediaAPIConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MultimediaAPIConfigs.
     */
    data: XOR<MultimediaAPIConfigUpdateManyMutationInput, MultimediaAPIConfigUncheckedUpdateManyInput>
    /**
     * Filter which MultimediaAPIConfigs to update
     */
    where?: MultimediaAPIConfigWhereInput
  }

  /**
   * MultimediaAPIConfig upsert
   */
  export type MultimediaAPIConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the MultimediaAPIConfig to update in case it exists.
     */
    where: MultimediaAPIConfigWhereUniqueInput
    /**
     * In case the MultimediaAPIConfig found by the `where` argument doesn't exist, create a new MultimediaAPIConfig with this data.
     */
    create: XOR<MultimediaAPIConfigCreateInput, MultimediaAPIConfigUncheckedCreateInput>
    /**
     * In case the MultimediaAPIConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MultimediaAPIConfigUpdateInput, MultimediaAPIConfigUncheckedUpdateInput>
  }

  /**
   * MultimediaAPIConfig delete
   */
  export type MultimediaAPIConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
    /**
     * Filter which MultimediaAPIConfig to delete.
     */
    where: MultimediaAPIConfigWhereUniqueInput
  }

  /**
   * MultimediaAPIConfig deleteMany
   */
  export type MultimediaAPIConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MultimediaAPIConfigs to delete
     */
    where?: MultimediaAPIConfigWhereInput
  }

  /**
   * MultimediaAPIConfig without action
   */
  export type MultimediaAPIConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MultimediaAPIConfig
     */
    select?: MultimediaAPIConfigSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MultimediaAPIConfigInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    password: 'password',
    balance: 'balance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    amount: 'amount',
    description: 'description',
    createdAt: 'createdAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const SymbolScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    icon: 'icon',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SymbolScalarFieldEnum = (typeof SymbolScalarFieldEnum)[keyof typeof SymbolScalarFieldEnum]


  export const QuickStoryboardConfigScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    description: 'description',
    threeViewTemplate: 'threeViewTemplate',
    multiGridTemplate: 'multiGridTemplate',
    styleComparisonTemplate: 'styleComparisonTemplate',
    narrativeProgressionTemplate: 'narrativeProgressionTemplate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QuickStoryboardConfigScalarFieldEnum = (typeof QuickStoryboardConfigScalarFieldEnum)[keyof typeof QuickStoryboardConfigScalarFieldEnum]


  export const GenerationHistoryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    prompt: 'prompt',
    images: 'images',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type GenerationHistoryScalarFieldEnum = (typeof GenerationHistoryScalarFieldEnum)[keyof typeof GenerationHistoryScalarFieldEnum]


  export const ActionSymbolScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    icon: 'icon',
    description: 'description',
    prompt: 'prompt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ActionSymbolScalarFieldEnum = (typeof ActionSymbolScalarFieldEnum)[keyof typeof ActionSymbolScalarFieldEnum]


  export const ActionConfigurationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    description: 'description',
    forwardTemplate: 'forwardTemplate',
    rotateTemplate: 'rotateTemplate',
    jumpTemplate: 'jumpTemplate',
    flyTemplate: 'flyTemplate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ActionConfigurationScalarFieldEnum = (typeof ActionConfigurationScalarFieldEnum)[keyof typeof ActionConfigurationScalarFieldEnum]


  export const MultimediaAPIConfigScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    config: 'config',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MultimediaAPIConfigScalarFieldEnum = (typeof MultimediaAPIConfigScalarFieldEnum)[keyof typeof MultimediaAPIConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    username?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    balance?: FloatFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    transactions?: TransactionListRelationFilter
    symbols?: SymbolListRelationFilter
    quickStoryboardConfigs?: QuickStoryboardConfigListRelationFilter
    generationHistory?: GenerationHistoryListRelationFilter
    actionSymbols?: ActionSymbolListRelationFilter
    actionConfigurations?: ActionConfigurationListRelationFilter
    multimediaAPIConfig?: XOR<MultimediaAPIConfigNullableRelationFilter, MultimediaAPIConfigWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transactions?: TransactionOrderByRelationAggregateInput
    symbols?: SymbolOrderByRelationAggregateInput
    quickStoryboardConfigs?: QuickStoryboardConfigOrderByRelationAggregateInput
    generationHistory?: GenerationHistoryOrderByRelationAggregateInput
    actionSymbols?: ActionSymbolOrderByRelationAggregateInput
    actionConfigurations?: ActionConfigurationOrderByRelationAggregateInput
    multimediaAPIConfig?: MultimediaAPIConfigOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    balance?: FloatFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    transactions?: TransactionListRelationFilter
    symbols?: SymbolListRelationFilter
    quickStoryboardConfigs?: QuickStoryboardConfigListRelationFilter
    generationHistory?: GenerationHistoryListRelationFilter
    actionSymbols?: ActionSymbolListRelationFilter
    actionConfigurations?: ActionConfigurationListRelationFilter
    multimediaAPIConfig?: XOR<MultimediaAPIConfigNullableRelationFilter, MultimediaAPIConfigWhereInput> | null
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    balance?: FloatWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: IntFilter<"Transaction"> | number
    userId?: IntFilter<"Transaction"> | number
    type?: StringFilter<"Transaction"> | string
    amount?: FloatFilter<"Transaction"> | number
    description?: StringNullableFilter<"Transaction"> | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    userId?: IntFilter<"Transaction"> | number
    type?: StringFilter<"Transaction"> | string
    amount?: FloatFilter<"Transaction"> | number
    description?: StringNullableFilter<"Transaction"> | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Transaction"> | number
    userId?: IntWithAggregatesFilter<"Transaction"> | number
    type?: StringWithAggregatesFilter<"Transaction"> | string
    amount?: FloatWithAggregatesFilter<"Transaction"> | number
    description?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type SymbolWhereInput = {
    AND?: SymbolWhereInput | SymbolWhereInput[]
    OR?: SymbolWhereInput[]
    NOT?: SymbolWhereInput | SymbolWhereInput[]
    id?: StringFilter<"Symbol"> | string
    userId?: IntFilter<"Symbol"> | number
    icon?: StringFilter<"Symbol"> | string
    name?: StringFilter<"Symbol"> | string
    description?: StringFilter<"Symbol"> | string
    createdAt?: DateTimeFilter<"Symbol"> | Date | string
    updatedAt?: DateTimeFilter<"Symbol"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SymbolOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SymbolWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SymbolWhereInput | SymbolWhereInput[]
    OR?: SymbolWhereInput[]
    NOT?: SymbolWhereInput | SymbolWhereInput[]
    userId?: IntFilter<"Symbol"> | number
    icon?: StringFilter<"Symbol"> | string
    name?: StringFilter<"Symbol"> | string
    description?: StringFilter<"Symbol"> | string
    createdAt?: DateTimeFilter<"Symbol"> | Date | string
    updatedAt?: DateTimeFilter<"Symbol"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type SymbolOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SymbolCountOrderByAggregateInput
    _avg?: SymbolAvgOrderByAggregateInput
    _max?: SymbolMaxOrderByAggregateInput
    _min?: SymbolMinOrderByAggregateInput
    _sum?: SymbolSumOrderByAggregateInput
  }

  export type SymbolScalarWhereWithAggregatesInput = {
    AND?: SymbolScalarWhereWithAggregatesInput | SymbolScalarWhereWithAggregatesInput[]
    OR?: SymbolScalarWhereWithAggregatesInput[]
    NOT?: SymbolScalarWhereWithAggregatesInput | SymbolScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Symbol"> | string
    userId?: IntWithAggregatesFilter<"Symbol"> | number
    icon?: StringWithAggregatesFilter<"Symbol"> | string
    name?: StringWithAggregatesFilter<"Symbol"> | string
    description?: StringWithAggregatesFilter<"Symbol"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Symbol"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Symbol"> | Date | string
  }

  export type QuickStoryboardConfigWhereInput = {
    AND?: QuickStoryboardConfigWhereInput | QuickStoryboardConfigWhereInput[]
    OR?: QuickStoryboardConfigWhereInput[]
    NOT?: QuickStoryboardConfigWhereInput | QuickStoryboardConfigWhereInput[]
    id?: StringFilter<"QuickStoryboardConfig"> | string
    userId?: IntFilter<"QuickStoryboardConfig"> | number
    name?: StringFilter<"QuickStoryboardConfig"> | string
    description?: StringFilter<"QuickStoryboardConfig"> | string
    threeViewTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    multiGridTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    styleComparisonTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    narrativeProgressionTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    createdAt?: DateTimeFilter<"QuickStoryboardConfig"> | Date | string
    updatedAt?: DateTimeFilter<"QuickStoryboardConfig"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type QuickStoryboardConfigOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    threeViewTemplate?: SortOrder
    multiGridTemplate?: SortOrder
    styleComparisonTemplate?: SortOrder
    narrativeProgressionTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type QuickStoryboardConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuickStoryboardConfigWhereInput | QuickStoryboardConfigWhereInput[]
    OR?: QuickStoryboardConfigWhereInput[]
    NOT?: QuickStoryboardConfigWhereInput | QuickStoryboardConfigWhereInput[]
    userId?: IntFilter<"QuickStoryboardConfig"> | number
    name?: StringFilter<"QuickStoryboardConfig"> | string
    description?: StringFilter<"QuickStoryboardConfig"> | string
    threeViewTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    multiGridTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    styleComparisonTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    narrativeProgressionTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    createdAt?: DateTimeFilter<"QuickStoryboardConfig"> | Date | string
    updatedAt?: DateTimeFilter<"QuickStoryboardConfig"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type QuickStoryboardConfigOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    threeViewTemplate?: SortOrder
    multiGridTemplate?: SortOrder
    styleComparisonTemplate?: SortOrder
    narrativeProgressionTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QuickStoryboardConfigCountOrderByAggregateInput
    _avg?: QuickStoryboardConfigAvgOrderByAggregateInput
    _max?: QuickStoryboardConfigMaxOrderByAggregateInput
    _min?: QuickStoryboardConfigMinOrderByAggregateInput
    _sum?: QuickStoryboardConfigSumOrderByAggregateInput
  }

  export type QuickStoryboardConfigScalarWhereWithAggregatesInput = {
    AND?: QuickStoryboardConfigScalarWhereWithAggregatesInput | QuickStoryboardConfigScalarWhereWithAggregatesInput[]
    OR?: QuickStoryboardConfigScalarWhereWithAggregatesInput[]
    NOT?: QuickStoryboardConfigScalarWhereWithAggregatesInput | QuickStoryboardConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QuickStoryboardConfig"> | string
    userId?: IntWithAggregatesFilter<"QuickStoryboardConfig"> | number
    name?: StringWithAggregatesFilter<"QuickStoryboardConfig"> | string
    description?: StringWithAggregatesFilter<"QuickStoryboardConfig"> | string
    threeViewTemplate?: StringWithAggregatesFilter<"QuickStoryboardConfig"> | string
    multiGridTemplate?: StringWithAggregatesFilter<"QuickStoryboardConfig"> | string
    styleComparisonTemplate?: StringWithAggregatesFilter<"QuickStoryboardConfig"> | string
    narrativeProgressionTemplate?: StringWithAggregatesFilter<"QuickStoryboardConfig"> | string
    createdAt?: DateTimeWithAggregatesFilter<"QuickStoryboardConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"QuickStoryboardConfig"> | Date | string
  }

  export type GenerationHistoryWhereInput = {
    AND?: GenerationHistoryWhereInput | GenerationHistoryWhereInput[]
    OR?: GenerationHistoryWhereInput[]
    NOT?: GenerationHistoryWhereInput | GenerationHistoryWhereInput[]
    id?: StringFilter<"GenerationHistory"> | string
    userId?: IntFilter<"GenerationHistory"> | number
    type?: StringFilter<"GenerationHistory"> | string
    prompt?: StringFilter<"GenerationHistory"> | string
    images?: StringNullableListFilter<"GenerationHistory">
    metadata?: JsonFilter<"GenerationHistory">
    createdAt?: DateTimeFilter<"GenerationHistory"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type GenerationHistoryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    prompt?: SortOrder
    images?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type GenerationHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GenerationHistoryWhereInput | GenerationHistoryWhereInput[]
    OR?: GenerationHistoryWhereInput[]
    NOT?: GenerationHistoryWhereInput | GenerationHistoryWhereInput[]
    userId?: IntFilter<"GenerationHistory"> | number
    type?: StringFilter<"GenerationHistory"> | string
    prompt?: StringFilter<"GenerationHistory"> | string
    images?: StringNullableListFilter<"GenerationHistory">
    metadata?: JsonFilter<"GenerationHistory">
    createdAt?: DateTimeFilter<"GenerationHistory"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type GenerationHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    prompt?: SortOrder
    images?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    _count?: GenerationHistoryCountOrderByAggregateInput
    _avg?: GenerationHistoryAvgOrderByAggregateInput
    _max?: GenerationHistoryMaxOrderByAggregateInput
    _min?: GenerationHistoryMinOrderByAggregateInput
    _sum?: GenerationHistorySumOrderByAggregateInput
  }

  export type GenerationHistoryScalarWhereWithAggregatesInput = {
    AND?: GenerationHistoryScalarWhereWithAggregatesInput | GenerationHistoryScalarWhereWithAggregatesInput[]
    OR?: GenerationHistoryScalarWhereWithAggregatesInput[]
    NOT?: GenerationHistoryScalarWhereWithAggregatesInput | GenerationHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GenerationHistory"> | string
    userId?: IntWithAggregatesFilter<"GenerationHistory"> | number
    type?: StringWithAggregatesFilter<"GenerationHistory"> | string
    prompt?: StringWithAggregatesFilter<"GenerationHistory"> | string
    images?: StringNullableListFilter<"GenerationHistory">
    metadata?: JsonWithAggregatesFilter<"GenerationHistory">
    createdAt?: DateTimeWithAggregatesFilter<"GenerationHistory"> | Date | string
  }

  export type ActionSymbolWhereInput = {
    AND?: ActionSymbolWhereInput | ActionSymbolWhereInput[]
    OR?: ActionSymbolWhereInput[]
    NOT?: ActionSymbolWhereInput | ActionSymbolWhereInput[]
    id?: StringFilter<"ActionSymbol"> | string
    userId?: IntFilter<"ActionSymbol"> | number
    name?: StringFilter<"ActionSymbol"> | string
    icon?: StringFilter<"ActionSymbol"> | string
    description?: StringFilter<"ActionSymbol"> | string
    prompt?: StringFilter<"ActionSymbol"> | string
    createdAt?: DateTimeFilter<"ActionSymbol"> | Date | string
    updatedAt?: DateTimeFilter<"ActionSymbol"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ActionSymbolOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ActionSymbolWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActionSymbolWhereInput | ActionSymbolWhereInput[]
    OR?: ActionSymbolWhereInput[]
    NOT?: ActionSymbolWhereInput | ActionSymbolWhereInput[]
    userId?: IntFilter<"ActionSymbol"> | number
    name?: StringFilter<"ActionSymbol"> | string
    icon?: StringFilter<"ActionSymbol"> | string
    description?: StringFilter<"ActionSymbol"> | string
    prompt?: StringFilter<"ActionSymbol"> | string
    createdAt?: DateTimeFilter<"ActionSymbol"> | Date | string
    updatedAt?: DateTimeFilter<"ActionSymbol"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ActionSymbolOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ActionSymbolCountOrderByAggregateInput
    _avg?: ActionSymbolAvgOrderByAggregateInput
    _max?: ActionSymbolMaxOrderByAggregateInput
    _min?: ActionSymbolMinOrderByAggregateInput
    _sum?: ActionSymbolSumOrderByAggregateInput
  }

  export type ActionSymbolScalarWhereWithAggregatesInput = {
    AND?: ActionSymbolScalarWhereWithAggregatesInput | ActionSymbolScalarWhereWithAggregatesInput[]
    OR?: ActionSymbolScalarWhereWithAggregatesInput[]
    NOT?: ActionSymbolScalarWhereWithAggregatesInput | ActionSymbolScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActionSymbol"> | string
    userId?: IntWithAggregatesFilter<"ActionSymbol"> | number
    name?: StringWithAggregatesFilter<"ActionSymbol"> | string
    icon?: StringWithAggregatesFilter<"ActionSymbol"> | string
    description?: StringWithAggregatesFilter<"ActionSymbol"> | string
    prompt?: StringWithAggregatesFilter<"ActionSymbol"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ActionSymbol"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ActionSymbol"> | Date | string
  }

  export type ActionConfigurationWhereInput = {
    AND?: ActionConfigurationWhereInput | ActionConfigurationWhereInput[]
    OR?: ActionConfigurationWhereInput[]
    NOT?: ActionConfigurationWhereInput | ActionConfigurationWhereInput[]
    id?: StringFilter<"ActionConfiguration"> | string
    userId?: IntFilter<"ActionConfiguration"> | number
    name?: StringFilter<"ActionConfiguration"> | string
    description?: StringFilter<"ActionConfiguration"> | string
    forwardTemplate?: StringFilter<"ActionConfiguration"> | string
    rotateTemplate?: StringFilter<"ActionConfiguration"> | string
    jumpTemplate?: StringFilter<"ActionConfiguration"> | string
    flyTemplate?: StringFilter<"ActionConfiguration"> | string
    createdAt?: DateTimeFilter<"ActionConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"ActionConfiguration"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ActionConfigurationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    forwardTemplate?: SortOrder
    rotateTemplate?: SortOrder
    jumpTemplate?: SortOrder
    flyTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ActionConfigurationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActionConfigurationWhereInput | ActionConfigurationWhereInput[]
    OR?: ActionConfigurationWhereInput[]
    NOT?: ActionConfigurationWhereInput | ActionConfigurationWhereInput[]
    userId?: IntFilter<"ActionConfiguration"> | number
    name?: StringFilter<"ActionConfiguration"> | string
    description?: StringFilter<"ActionConfiguration"> | string
    forwardTemplate?: StringFilter<"ActionConfiguration"> | string
    rotateTemplate?: StringFilter<"ActionConfiguration"> | string
    jumpTemplate?: StringFilter<"ActionConfiguration"> | string
    flyTemplate?: StringFilter<"ActionConfiguration"> | string
    createdAt?: DateTimeFilter<"ActionConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"ActionConfiguration"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ActionConfigurationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    forwardTemplate?: SortOrder
    rotateTemplate?: SortOrder
    jumpTemplate?: SortOrder
    flyTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ActionConfigurationCountOrderByAggregateInput
    _avg?: ActionConfigurationAvgOrderByAggregateInput
    _max?: ActionConfigurationMaxOrderByAggregateInput
    _min?: ActionConfigurationMinOrderByAggregateInput
    _sum?: ActionConfigurationSumOrderByAggregateInput
  }

  export type ActionConfigurationScalarWhereWithAggregatesInput = {
    AND?: ActionConfigurationScalarWhereWithAggregatesInput | ActionConfigurationScalarWhereWithAggregatesInput[]
    OR?: ActionConfigurationScalarWhereWithAggregatesInput[]
    NOT?: ActionConfigurationScalarWhereWithAggregatesInput | ActionConfigurationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActionConfiguration"> | string
    userId?: IntWithAggregatesFilter<"ActionConfiguration"> | number
    name?: StringWithAggregatesFilter<"ActionConfiguration"> | string
    description?: StringWithAggregatesFilter<"ActionConfiguration"> | string
    forwardTemplate?: StringWithAggregatesFilter<"ActionConfiguration"> | string
    rotateTemplate?: StringWithAggregatesFilter<"ActionConfiguration"> | string
    jumpTemplate?: StringWithAggregatesFilter<"ActionConfiguration"> | string
    flyTemplate?: StringWithAggregatesFilter<"ActionConfiguration"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ActionConfiguration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ActionConfiguration"> | Date | string
  }

  export type MultimediaAPIConfigWhereInput = {
    AND?: MultimediaAPIConfigWhereInput | MultimediaAPIConfigWhereInput[]
    OR?: MultimediaAPIConfigWhereInput[]
    NOT?: MultimediaAPIConfigWhereInput | MultimediaAPIConfigWhereInput[]
    id?: StringFilter<"MultimediaAPIConfig"> | string
    userId?: IntFilter<"MultimediaAPIConfig"> | number
    config?: JsonFilter<"MultimediaAPIConfig">
    createdAt?: DateTimeFilter<"MultimediaAPIConfig"> | Date | string
    updatedAt?: DateTimeFilter<"MultimediaAPIConfig"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type MultimediaAPIConfigOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MultimediaAPIConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: number
    AND?: MultimediaAPIConfigWhereInput | MultimediaAPIConfigWhereInput[]
    OR?: MultimediaAPIConfigWhereInput[]
    NOT?: MultimediaAPIConfigWhereInput | MultimediaAPIConfigWhereInput[]
    config?: JsonFilter<"MultimediaAPIConfig">
    createdAt?: DateTimeFilter<"MultimediaAPIConfig"> | Date | string
    updatedAt?: DateTimeFilter<"MultimediaAPIConfig"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type MultimediaAPIConfigOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MultimediaAPIConfigCountOrderByAggregateInput
    _avg?: MultimediaAPIConfigAvgOrderByAggregateInput
    _max?: MultimediaAPIConfigMaxOrderByAggregateInput
    _min?: MultimediaAPIConfigMinOrderByAggregateInput
    _sum?: MultimediaAPIConfigSumOrderByAggregateInput
  }

  export type MultimediaAPIConfigScalarWhereWithAggregatesInput = {
    AND?: MultimediaAPIConfigScalarWhereWithAggregatesInput | MultimediaAPIConfigScalarWhereWithAggregatesInput[]
    OR?: MultimediaAPIConfigScalarWhereWithAggregatesInput[]
    NOT?: MultimediaAPIConfigScalarWhereWithAggregatesInput | MultimediaAPIConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MultimediaAPIConfig"> | string
    userId?: IntWithAggregatesFilter<"MultimediaAPIConfig"> | number
    config?: JsonWithAggregatesFilter<"MultimediaAPIConfig">
    createdAt?: DateTimeWithAggregatesFilter<"MultimediaAPIConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MultimediaAPIConfig"> | Date | string
  }

  export type UserCreateInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
    symbols?: SymbolCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    symbols?: SymbolUncheckedCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryUncheckedCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolUncheckedCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationUncheckedCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    symbols?: SymbolUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    symbols?: SymbolUncheckedUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUncheckedUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    type: string
    amount: number
    description?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: number
    userId: number
    type: string
    amount: number
    description?: string | null
    createdAt?: Date | string
  }

  export type TransactionUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: number
    userId: number
    type: string
    amount: number
    description?: string | null
    createdAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolCreateInput = {
    id?: string
    icon: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSymbolsInput
  }

  export type SymbolUncheckedCreateInput = {
    id?: string
    userId: number
    icon: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SymbolUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSymbolsNestedInput
  }

  export type SymbolUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolCreateManyInput = {
    id?: string
    userId: number
    icon: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SymbolUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuickStoryboardConfigCreateInput = {
    id?: string
    name: string
    description: string
    threeViewTemplate?: string
    multiGridTemplate?: string
    styleComparisonTemplate?: string
    narrativeProgressionTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutQuickStoryboardConfigsInput
  }

  export type QuickStoryboardConfigUncheckedCreateInput = {
    id?: string
    userId: number
    name: string
    description: string
    threeViewTemplate?: string
    multiGridTemplate?: string
    styleComparisonTemplate?: string
    narrativeProgressionTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuickStoryboardConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    threeViewTemplate?: StringFieldUpdateOperationsInput | string
    multiGridTemplate?: StringFieldUpdateOperationsInput | string
    styleComparisonTemplate?: StringFieldUpdateOperationsInput | string
    narrativeProgressionTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutQuickStoryboardConfigsNestedInput
  }

  export type QuickStoryboardConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    threeViewTemplate?: StringFieldUpdateOperationsInput | string
    multiGridTemplate?: StringFieldUpdateOperationsInput | string
    styleComparisonTemplate?: StringFieldUpdateOperationsInput | string
    narrativeProgressionTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuickStoryboardConfigCreateManyInput = {
    id?: string
    userId: number
    name: string
    description: string
    threeViewTemplate?: string
    multiGridTemplate?: string
    styleComparisonTemplate?: string
    narrativeProgressionTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuickStoryboardConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    threeViewTemplate?: StringFieldUpdateOperationsInput | string
    multiGridTemplate?: StringFieldUpdateOperationsInput | string
    styleComparisonTemplate?: StringFieldUpdateOperationsInput | string
    narrativeProgressionTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuickStoryboardConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    threeViewTemplate?: StringFieldUpdateOperationsInput | string
    multiGridTemplate?: StringFieldUpdateOperationsInput | string
    styleComparisonTemplate?: StringFieldUpdateOperationsInput | string
    narrativeProgressionTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationHistoryCreateInput = {
    id?: string
    type: string
    prompt: string
    images?: GenerationHistoryCreateimagesInput | string[]
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutGenerationHistoryInput
  }

  export type GenerationHistoryUncheckedCreateInput = {
    id?: string
    userId: number
    type: string
    prompt: string
    images?: GenerationHistoryCreateimagesInput | string[]
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GenerationHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    images?: GenerationHistoryUpdateimagesInput | string[]
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGenerationHistoryNestedInput
  }

  export type GenerationHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    images?: GenerationHistoryUpdateimagesInput | string[]
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationHistoryCreateManyInput = {
    id?: string
    userId: number
    type: string
    prompt: string
    images?: GenerationHistoryCreateimagesInput | string[]
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GenerationHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    images?: GenerationHistoryUpdateimagesInput | string[]
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    images?: GenerationHistoryUpdateimagesInput | string[]
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionSymbolCreateInput = {
    id?: string
    name: string
    icon: string
    description: string
    prompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutActionSymbolsInput
  }

  export type ActionSymbolUncheckedCreateInput = {
    id?: string
    userId: number
    name: string
    icon: string
    description: string
    prompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionSymbolUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActionSymbolsNestedInput
  }

  export type ActionSymbolUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionSymbolCreateManyInput = {
    id?: string
    userId: number
    name: string
    icon: string
    description: string
    prompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionSymbolUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionSymbolUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionConfigurationCreateInput = {
    id?: string
    name: string
    description: string
    forwardTemplate?: string
    rotateTemplate?: string
    jumpTemplate?: string
    flyTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutActionConfigurationsInput
  }

  export type ActionConfigurationUncheckedCreateInput = {
    id?: string
    userId: number
    name: string
    description: string
    forwardTemplate?: string
    rotateTemplate?: string
    jumpTemplate?: string
    flyTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionConfigurationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    forwardTemplate?: StringFieldUpdateOperationsInput | string
    rotateTemplate?: StringFieldUpdateOperationsInput | string
    jumpTemplate?: StringFieldUpdateOperationsInput | string
    flyTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutActionConfigurationsNestedInput
  }

  export type ActionConfigurationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    forwardTemplate?: StringFieldUpdateOperationsInput | string
    rotateTemplate?: StringFieldUpdateOperationsInput | string
    jumpTemplate?: StringFieldUpdateOperationsInput | string
    flyTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionConfigurationCreateManyInput = {
    id?: string
    userId: number
    name: string
    description: string
    forwardTemplate?: string
    rotateTemplate?: string
    jumpTemplate?: string
    flyTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionConfigurationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    forwardTemplate?: StringFieldUpdateOperationsInput | string
    rotateTemplate?: StringFieldUpdateOperationsInput | string
    jumpTemplate?: StringFieldUpdateOperationsInput | string
    flyTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionConfigurationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    forwardTemplate?: StringFieldUpdateOperationsInput | string
    rotateTemplate?: StringFieldUpdateOperationsInput | string
    jumpTemplate?: StringFieldUpdateOperationsInput | string
    flyTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MultimediaAPIConfigCreateInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMultimediaAPIConfigInput
  }

  export type MultimediaAPIConfigUncheckedCreateInput = {
    id?: string
    userId: number
    config: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MultimediaAPIConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMultimediaAPIConfigNestedInput
  }

  export type MultimediaAPIConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    config?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MultimediaAPIConfigCreateManyInput = {
    id?: string
    userId: number
    config: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MultimediaAPIConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MultimediaAPIConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    config?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type SymbolListRelationFilter = {
    every?: SymbolWhereInput
    some?: SymbolWhereInput
    none?: SymbolWhereInput
  }

  export type QuickStoryboardConfigListRelationFilter = {
    every?: QuickStoryboardConfigWhereInput
    some?: QuickStoryboardConfigWhereInput
    none?: QuickStoryboardConfigWhereInput
  }

  export type GenerationHistoryListRelationFilter = {
    every?: GenerationHistoryWhereInput
    some?: GenerationHistoryWhereInput
    none?: GenerationHistoryWhereInput
  }

  export type ActionSymbolListRelationFilter = {
    every?: ActionSymbolWhereInput
    some?: ActionSymbolWhereInput
    none?: ActionSymbolWhereInput
  }

  export type ActionConfigurationListRelationFilter = {
    every?: ActionConfigurationWhereInput
    some?: ActionConfigurationWhereInput
    none?: ActionConfigurationWhereInput
  }

  export type MultimediaAPIConfigNullableRelationFilter = {
    is?: MultimediaAPIConfigWhereInput | null
    isNot?: MultimediaAPIConfigWhereInput | null
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SymbolOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuickStoryboardConfigOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GenerationHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActionSymbolOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActionConfigurationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    balance?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type SymbolCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SymbolAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type SymbolMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SymbolMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    icon?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SymbolSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type QuickStoryboardConfigCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    threeViewTemplate?: SortOrder
    multiGridTemplate?: SortOrder
    styleComparisonTemplate?: SortOrder
    narrativeProgressionTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuickStoryboardConfigAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type QuickStoryboardConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    threeViewTemplate?: SortOrder
    multiGridTemplate?: SortOrder
    styleComparisonTemplate?: SortOrder
    narrativeProgressionTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuickStoryboardConfigMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    threeViewTemplate?: SortOrder
    multiGridTemplate?: SortOrder
    styleComparisonTemplate?: SortOrder
    narrativeProgressionTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QuickStoryboardConfigSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type GenerationHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    prompt?: SortOrder
    images?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type GenerationHistoryAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type GenerationHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
  }

  export type GenerationHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
  }

  export type GenerationHistorySumOrderByAggregateInput = {
    userId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ActionSymbolCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionSymbolAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ActionSymbolMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionSymbolMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    icon?: SortOrder
    description?: SortOrder
    prompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionSymbolSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ActionConfigurationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    forwardTemplate?: SortOrder
    rotateTemplate?: SortOrder
    jumpTemplate?: SortOrder
    flyTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionConfigurationAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ActionConfigurationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    forwardTemplate?: SortOrder
    rotateTemplate?: SortOrder
    jumpTemplate?: SortOrder
    flyTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionConfigurationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    forwardTemplate?: SortOrder
    rotateTemplate?: SortOrder
    jumpTemplate?: SortOrder
    flyTemplate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionConfigurationSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type MultimediaAPIConfigCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    config?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MultimediaAPIConfigAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type MultimediaAPIConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MultimediaAPIConfigMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MultimediaAPIConfigSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type TransactionCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type SymbolCreateNestedManyWithoutUserInput = {
    create?: XOR<SymbolCreateWithoutUserInput, SymbolUncheckedCreateWithoutUserInput> | SymbolCreateWithoutUserInput[] | SymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SymbolCreateOrConnectWithoutUserInput | SymbolCreateOrConnectWithoutUserInput[]
    createMany?: SymbolCreateManyUserInputEnvelope
    connect?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
  }

  export type QuickStoryboardConfigCreateNestedManyWithoutUserInput = {
    create?: XOR<QuickStoryboardConfigCreateWithoutUserInput, QuickStoryboardConfigUncheckedCreateWithoutUserInput> | QuickStoryboardConfigCreateWithoutUserInput[] | QuickStoryboardConfigUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuickStoryboardConfigCreateOrConnectWithoutUserInput | QuickStoryboardConfigCreateOrConnectWithoutUserInput[]
    createMany?: QuickStoryboardConfigCreateManyUserInputEnvelope
    connect?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
  }

  export type GenerationHistoryCreateNestedManyWithoutUserInput = {
    create?: XOR<GenerationHistoryCreateWithoutUserInput, GenerationHistoryUncheckedCreateWithoutUserInput> | GenerationHistoryCreateWithoutUserInput[] | GenerationHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationHistoryCreateOrConnectWithoutUserInput | GenerationHistoryCreateOrConnectWithoutUserInput[]
    createMany?: GenerationHistoryCreateManyUserInputEnvelope
    connect?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
  }

  export type ActionSymbolCreateNestedManyWithoutUserInput = {
    create?: XOR<ActionSymbolCreateWithoutUserInput, ActionSymbolUncheckedCreateWithoutUserInput> | ActionSymbolCreateWithoutUserInput[] | ActionSymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionSymbolCreateOrConnectWithoutUserInput | ActionSymbolCreateOrConnectWithoutUserInput[]
    createMany?: ActionSymbolCreateManyUserInputEnvelope
    connect?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
  }

  export type ActionConfigurationCreateNestedManyWithoutUserInput = {
    create?: XOR<ActionConfigurationCreateWithoutUserInput, ActionConfigurationUncheckedCreateWithoutUserInput> | ActionConfigurationCreateWithoutUserInput[] | ActionConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionConfigurationCreateOrConnectWithoutUserInput | ActionConfigurationCreateOrConnectWithoutUserInput[]
    createMany?: ActionConfigurationCreateManyUserInputEnvelope
    connect?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
  }

  export type MultimediaAPIConfigCreateNestedOneWithoutUserInput = {
    create?: XOR<MultimediaAPIConfigCreateWithoutUserInput, MultimediaAPIConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: MultimediaAPIConfigCreateOrConnectWithoutUserInput
    connect?: MultimediaAPIConfigWhereUniqueInput
  }

  export type TransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type SymbolUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SymbolCreateWithoutUserInput, SymbolUncheckedCreateWithoutUserInput> | SymbolCreateWithoutUserInput[] | SymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SymbolCreateOrConnectWithoutUserInput | SymbolCreateOrConnectWithoutUserInput[]
    createMany?: SymbolCreateManyUserInputEnvelope
    connect?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
  }

  export type QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<QuickStoryboardConfigCreateWithoutUserInput, QuickStoryboardConfigUncheckedCreateWithoutUserInput> | QuickStoryboardConfigCreateWithoutUserInput[] | QuickStoryboardConfigUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuickStoryboardConfigCreateOrConnectWithoutUserInput | QuickStoryboardConfigCreateOrConnectWithoutUserInput[]
    createMany?: QuickStoryboardConfigCreateManyUserInputEnvelope
    connect?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
  }

  export type GenerationHistoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GenerationHistoryCreateWithoutUserInput, GenerationHistoryUncheckedCreateWithoutUserInput> | GenerationHistoryCreateWithoutUserInput[] | GenerationHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationHistoryCreateOrConnectWithoutUserInput | GenerationHistoryCreateOrConnectWithoutUserInput[]
    createMany?: GenerationHistoryCreateManyUserInputEnvelope
    connect?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
  }

  export type ActionSymbolUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ActionSymbolCreateWithoutUserInput, ActionSymbolUncheckedCreateWithoutUserInput> | ActionSymbolCreateWithoutUserInput[] | ActionSymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionSymbolCreateOrConnectWithoutUserInput | ActionSymbolCreateOrConnectWithoutUserInput[]
    createMany?: ActionSymbolCreateManyUserInputEnvelope
    connect?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
  }

  export type ActionConfigurationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ActionConfigurationCreateWithoutUserInput, ActionConfigurationUncheckedCreateWithoutUserInput> | ActionConfigurationCreateWithoutUserInput[] | ActionConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionConfigurationCreateOrConnectWithoutUserInput | ActionConfigurationCreateOrConnectWithoutUserInput[]
    createMany?: ActionConfigurationCreateManyUserInputEnvelope
    connect?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
  }

  export type MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<MultimediaAPIConfigCreateWithoutUserInput, MultimediaAPIConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: MultimediaAPIConfigCreateOrConnectWithoutUserInput
    connect?: MultimediaAPIConfigWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TransactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type SymbolUpdateManyWithoutUserNestedInput = {
    create?: XOR<SymbolCreateWithoutUserInput, SymbolUncheckedCreateWithoutUserInput> | SymbolCreateWithoutUserInput[] | SymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SymbolCreateOrConnectWithoutUserInput | SymbolCreateOrConnectWithoutUserInput[]
    upsert?: SymbolUpsertWithWhereUniqueWithoutUserInput | SymbolUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SymbolCreateManyUserInputEnvelope
    set?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    disconnect?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    delete?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    connect?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    update?: SymbolUpdateWithWhereUniqueWithoutUserInput | SymbolUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SymbolUpdateManyWithWhereWithoutUserInput | SymbolUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SymbolScalarWhereInput | SymbolScalarWhereInput[]
  }

  export type QuickStoryboardConfigUpdateManyWithoutUserNestedInput = {
    create?: XOR<QuickStoryboardConfigCreateWithoutUserInput, QuickStoryboardConfigUncheckedCreateWithoutUserInput> | QuickStoryboardConfigCreateWithoutUserInput[] | QuickStoryboardConfigUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuickStoryboardConfigCreateOrConnectWithoutUserInput | QuickStoryboardConfigCreateOrConnectWithoutUserInput[]
    upsert?: QuickStoryboardConfigUpsertWithWhereUniqueWithoutUserInput | QuickStoryboardConfigUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QuickStoryboardConfigCreateManyUserInputEnvelope
    set?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    disconnect?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    delete?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    connect?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    update?: QuickStoryboardConfigUpdateWithWhereUniqueWithoutUserInput | QuickStoryboardConfigUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QuickStoryboardConfigUpdateManyWithWhereWithoutUserInput | QuickStoryboardConfigUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QuickStoryboardConfigScalarWhereInput | QuickStoryboardConfigScalarWhereInput[]
  }

  export type GenerationHistoryUpdateManyWithoutUserNestedInput = {
    create?: XOR<GenerationHistoryCreateWithoutUserInput, GenerationHistoryUncheckedCreateWithoutUserInput> | GenerationHistoryCreateWithoutUserInput[] | GenerationHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationHistoryCreateOrConnectWithoutUserInput | GenerationHistoryCreateOrConnectWithoutUserInput[]
    upsert?: GenerationHistoryUpsertWithWhereUniqueWithoutUserInput | GenerationHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GenerationHistoryCreateManyUserInputEnvelope
    set?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    disconnect?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    delete?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    connect?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    update?: GenerationHistoryUpdateWithWhereUniqueWithoutUserInput | GenerationHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GenerationHistoryUpdateManyWithWhereWithoutUserInput | GenerationHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GenerationHistoryScalarWhereInput | GenerationHistoryScalarWhereInput[]
  }

  export type ActionSymbolUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActionSymbolCreateWithoutUserInput, ActionSymbolUncheckedCreateWithoutUserInput> | ActionSymbolCreateWithoutUserInput[] | ActionSymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionSymbolCreateOrConnectWithoutUserInput | ActionSymbolCreateOrConnectWithoutUserInput[]
    upsert?: ActionSymbolUpsertWithWhereUniqueWithoutUserInput | ActionSymbolUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActionSymbolCreateManyUserInputEnvelope
    set?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    disconnect?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    delete?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    connect?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    update?: ActionSymbolUpdateWithWhereUniqueWithoutUserInput | ActionSymbolUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActionSymbolUpdateManyWithWhereWithoutUserInput | ActionSymbolUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActionSymbolScalarWhereInput | ActionSymbolScalarWhereInput[]
  }

  export type ActionConfigurationUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActionConfigurationCreateWithoutUserInput, ActionConfigurationUncheckedCreateWithoutUserInput> | ActionConfigurationCreateWithoutUserInput[] | ActionConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionConfigurationCreateOrConnectWithoutUserInput | ActionConfigurationCreateOrConnectWithoutUserInput[]
    upsert?: ActionConfigurationUpsertWithWhereUniqueWithoutUserInput | ActionConfigurationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActionConfigurationCreateManyUserInputEnvelope
    set?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    disconnect?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    delete?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    connect?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    update?: ActionConfigurationUpdateWithWhereUniqueWithoutUserInput | ActionConfigurationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActionConfigurationUpdateManyWithWhereWithoutUserInput | ActionConfigurationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActionConfigurationScalarWhereInput | ActionConfigurationScalarWhereInput[]
  }

  export type MultimediaAPIConfigUpdateOneWithoutUserNestedInput = {
    create?: XOR<MultimediaAPIConfigCreateWithoutUserInput, MultimediaAPIConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: MultimediaAPIConfigCreateOrConnectWithoutUserInput
    upsert?: MultimediaAPIConfigUpsertWithoutUserInput
    disconnect?: MultimediaAPIConfigWhereInput | boolean
    delete?: MultimediaAPIConfigWhereInput | boolean
    connect?: MultimediaAPIConfigWhereUniqueInput
    update?: XOR<XOR<MultimediaAPIConfigUpdateToOneWithWhereWithoutUserInput, MultimediaAPIConfigUpdateWithoutUserInput>, MultimediaAPIConfigUncheckedUpdateWithoutUserInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type SymbolUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SymbolCreateWithoutUserInput, SymbolUncheckedCreateWithoutUserInput> | SymbolCreateWithoutUserInput[] | SymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SymbolCreateOrConnectWithoutUserInput | SymbolCreateOrConnectWithoutUserInput[]
    upsert?: SymbolUpsertWithWhereUniqueWithoutUserInput | SymbolUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SymbolCreateManyUserInputEnvelope
    set?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    disconnect?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    delete?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    connect?: SymbolWhereUniqueInput | SymbolWhereUniqueInput[]
    update?: SymbolUpdateWithWhereUniqueWithoutUserInput | SymbolUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SymbolUpdateManyWithWhereWithoutUserInput | SymbolUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SymbolScalarWhereInput | SymbolScalarWhereInput[]
  }

  export type QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<QuickStoryboardConfigCreateWithoutUserInput, QuickStoryboardConfigUncheckedCreateWithoutUserInput> | QuickStoryboardConfigCreateWithoutUserInput[] | QuickStoryboardConfigUncheckedCreateWithoutUserInput[]
    connectOrCreate?: QuickStoryboardConfigCreateOrConnectWithoutUserInput | QuickStoryboardConfigCreateOrConnectWithoutUserInput[]
    upsert?: QuickStoryboardConfigUpsertWithWhereUniqueWithoutUserInput | QuickStoryboardConfigUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: QuickStoryboardConfigCreateManyUserInputEnvelope
    set?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    disconnect?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    delete?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    connect?: QuickStoryboardConfigWhereUniqueInput | QuickStoryboardConfigWhereUniqueInput[]
    update?: QuickStoryboardConfigUpdateWithWhereUniqueWithoutUserInput | QuickStoryboardConfigUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: QuickStoryboardConfigUpdateManyWithWhereWithoutUserInput | QuickStoryboardConfigUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: QuickStoryboardConfigScalarWhereInput | QuickStoryboardConfigScalarWhereInput[]
  }

  export type GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GenerationHistoryCreateWithoutUserInput, GenerationHistoryUncheckedCreateWithoutUserInput> | GenerationHistoryCreateWithoutUserInput[] | GenerationHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GenerationHistoryCreateOrConnectWithoutUserInput | GenerationHistoryCreateOrConnectWithoutUserInput[]
    upsert?: GenerationHistoryUpsertWithWhereUniqueWithoutUserInput | GenerationHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GenerationHistoryCreateManyUserInputEnvelope
    set?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    disconnect?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    delete?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    connect?: GenerationHistoryWhereUniqueInput | GenerationHistoryWhereUniqueInput[]
    update?: GenerationHistoryUpdateWithWhereUniqueWithoutUserInput | GenerationHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GenerationHistoryUpdateManyWithWhereWithoutUserInput | GenerationHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GenerationHistoryScalarWhereInput | GenerationHistoryScalarWhereInput[]
  }

  export type ActionSymbolUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActionSymbolCreateWithoutUserInput, ActionSymbolUncheckedCreateWithoutUserInput> | ActionSymbolCreateWithoutUserInput[] | ActionSymbolUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionSymbolCreateOrConnectWithoutUserInput | ActionSymbolCreateOrConnectWithoutUserInput[]
    upsert?: ActionSymbolUpsertWithWhereUniqueWithoutUserInput | ActionSymbolUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActionSymbolCreateManyUserInputEnvelope
    set?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    disconnect?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    delete?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    connect?: ActionSymbolWhereUniqueInput | ActionSymbolWhereUniqueInput[]
    update?: ActionSymbolUpdateWithWhereUniqueWithoutUserInput | ActionSymbolUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActionSymbolUpdateManyWithWhereWithoutUserInput | ActionSymbolUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActionSymbolScalarWhereInput | ActionSymbolScalarWhereInput[]
  }

  export type ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ActionConfigurationCreateWithoutUserInput, ActionConfigurationUncheckedCreateWithoutUserInput> | ActionConfigurationCreateWithoutUserInput[] | ActionConfigurationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ActionConfigurationCreateOrConnectWithoutUserInput | ActionConfigurationCreateOrConnectWithoutUserInput[]
    upsert?: ActionConfigurationUpsertWithWhereUniqueWithoutUserInput | ActionConfigurationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ActionConfigurationCreateManyUserInputEnvelope
    set?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    disconnect?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    delete?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    connect?: ActionConfigurationWhereUniqueInput | ActionConfigurationWhereUniqueInput[]
    update?: ActionConfigurationUpdateWithWhereUniqueWithoutUserInput | ActionConfigurationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ActionConfigurationUpdateManyWithWhereWithoutUserInput | ActionConfigurationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ActionConfigurationScalarWhereInput | ActionConfigurationScalarWhereInput[]
  }

  export type MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<MultimediaAPIConfigCreateWithoutUserInput, MultimediaAPIConfigUncheckedCreateWithoutUserInput>
    connectOrCreate?: MultimediaAPIConfigCreateOrConnectWithoutUserInput
    upsert?: MultimediaAPIConfigUpsertWithoutUserInput
    disconnect?: MultimediaAPIConfigWhereInput | boolean
    delete?: MultimediaAPIConfigWhereInput | boolean
    connect?: MultimediaAPIConfigWhereUniqueInput
    update?: XOR<XOR<MultimediaAPIConfigUpdateToOneWithWhereWithoutUserInput, MultimediaAPIConfigUpdateWithoutUserInput>, MultimediaAPIConfigUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    upsert?: UserUpsertWithoutTransactionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsInput, UserUpdateWithoutTransactionsInput>, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserCreateNestedOneWithoutSymbolsInput = {
    create?: XOR<UserCreateWithoutSymbolsInput, UserUncheckedCreateWithoutSymbolsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSymbolsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSymbolsNestedInput = {
    create?: XOR<UserCreateWithoutSymbolsInput, UserUncheckedCreateWithoutSymbolsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSymbolsInput
    upsert?: UserUpsertWithoutSymbolsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSymbolsInput, UserUpdateWithoutSymbolsInput>, UserUncheckedUpdateWithoutSymbolsInput>
  }

  export type UserCreateNestedOneWithoutQuickStoryboardConfigsInput = {
    create?: XOR<UserCreateWithoutQuickStoryboardConfigsInput, UserUncheckedCreateWithoutQuickStoryboardConfigsInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuickStoryboardConfigsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutQuickStoryboardConfigsNestedInput = {
    create?: XOR<UserCreateWithoutQuickStoryboardConfigsInput, UserUncheckedCreateWithoutQuickStoryboardConfigsInput>
    connectOrCreate?: UserCreateOrConnectWithoutQuickStoryboardConfigsInput
    upsert?: UserUpsertWithoutQuickStoryboardConfigsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutQuickStoryboardConfigsInput, UserUpdateWithoutQuickStoryboardConfigsInput>, UserUncheckedUpdateWithoutQuickStoryboardConfigsInput>
  }

  export type GenerationHistoryCreateimagesInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutGenerationHistoryInput = {
    create?: XOR<UserCreateWithoutGenerationHistoryInput, UserUncheckedCreateWithoutGenerationHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutGenerationHistoryInput
    connect?: UserWhereUniqueInput
  }

  export type GenerationHistoryUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutGenerationHistoryNestedInput = {
    create?: XOR<UserCreateWithoutGenerationHistoryInput, UserUncheckedCreateWithoutGenerationHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutGenerationHistoryInput
    upsert?: UserUpsertWithoutGenerationHistoryInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGenerationHistoryInput, UserUpdateWithoutGenerationHistoryInput>, UserUncheckedUpdateWithoutGenerationHistoryInput>
  }

  export type UserCreateNestedOneWithoutActionSymbolsInput = {
    create?: XOR<UserCreateWithoutActionSymbolsInput, UserUncheckedCreateWithoutActionSymbolsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActionSymbolsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutActionSymbolsNestedInput = {
    create?: XOR<UserCreateWithoutActionSymbolsInput, UserUncheckedCreateWithoutActionSymbolsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActionSymbolsInput
    upsert?: UserUpsertWithoutActionSymbolsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActionSymbolsInput, UserUpdateWithoutActionSymbolsInput>, UserUncheckedUpdateWithoutActionSymbolsInput>
  }

  export type UserCreateNestedOneWithoutActionConfigurationsInput = {
    create?: XOR<UserCreateWithoutActionConfigurationsInput, UserUncheckedCreateWithoutActionConfigurationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActionConfigurationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutActionConfigurationsNestedInput = {
    create?: XOR<UserCreateWithoutActionConfigurationsInput, UserUncheckedCreateWithoutActionConfigurationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActionConfigurationsInput
    upsert?: UserUpsertWithoutActionConfigurationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActionConfigurationsInput, UserUpdateWithoutActionConfigurationsInput>, UserUncheckedUpdateWithoutActionConfigurationsInput>
  }

  export type UserCreateNestedOneWithoutMultimediaAPIConfigInput = {
    create?: XOR<UserCreateWithoutMultimediaAPIConfigInput, UserUncheckedCreateWithoutMultimediaAPIConfigInput>
    connectOrCreate?: UserCreateOrConnectWithoutMultimediaAPIConfigInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMultimediaAPIConfigNestedInput = {
    create?: XOR<UserCreateWithoutMultimediaAPIConfigInput, UserUncheckedCreateWithoutMultimediaAPIConfigInput>
    connectOrCreate?: UserCreateOrConnectWithoutMultimediaAPIConfigInput
    upsert?: UserUpsertWithoutMultimediaAPIConfigInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMultimediaAPIConfigInput, UserUpdateWithoutMultimediaAPIConfigInput>, UserUncheckedUpdateWithoutMultimediaAPIConfigInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TransactionCreateWithoutUserInput = {
    type: string
    amount: number
    description?: string | null
    createdAt?: Date | string
  }

  export type TransactionUncheckedCreateWithoutUserInput = {
    id?: number
    type: string
    amount: number
    description?: string | null
    createdAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionCreateManyUserInputEnvelope = {
    data: TransactionCreateManyUserInput | TransactionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SymbolCreateWithoutUserInput = {
    id?: string
    icon: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SymbolUncheckedCreateWithoutUserInput = {
    id?: string
    icon: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SymbolCreateOrConnectWithoutUserInput = {
    where: SymbolWhereUniqueInput
    create: XOR<SymbolCreateWithoutUserInput, SymbolUncheckedCreateWithoutUserInput>
  }

  export type SymbolCreateManyUserInputEnvelope = {
    data: SymbolCreateManyUserInput | SymbolCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type QuickStoryboardConfigCreateWithoutUserInput = {
    id?: string
    name: string
    description: string
    threeViewTemplate?: string
    multiGridTemplate?: string
    styleComparisonTemplate?: string
    narrativeProgressionTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuickStoryboardConfigUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description: string
    threeViewTemplate?: string
    multiGridTemplate?: string
    styleComparisonTemplate?: string
    narrativeProgressionTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuickStoryboardConfigCreateOrConnectWithoutUserInput = {
    where: QuickStoryboardConfigWhereUniqueInput
    create: XOR<QuickStoryboardConfigCreateWithoutUserInput, QuickStoryboardConfigUncheckedCreateWithoutUserInput>
  }

  export type QuickStoryboardConfigCreateManyUserInputEnvelope = {
    data: QuickStoryboardConfigCreateManyUserInput | QuickStoryboardConfigCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GenerationHistoryCreateWithoutUserInput = {
    id?: string
    type: string
    prompt: string
    images?: GenerationHistoryCreateimagesInput | string[]
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GenerationHistoryUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    prompt: string
    images?: GenerationHistoryCreateimagesInput | string[]
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GenerationHistoryCreateOrConnectWithoutUserInput = {
    where: GenerationHistoryWhereUniqueInput
    create: XOR<GenerationHistoryCreateWithoutUserInput, GenerationHistoryUncheckedCreateWithoutUserInput>
  }

  export type GenerationHistoryCreateManyUserInputEnvelope = {
    data: GenerationHistoryCreateManyUserInput | GenerationHistoryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ActionSymbolCreateWithoutUserInput = {
    id?: string
    name: string
    icon: string
    description: string
    prompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionSymbolUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    icon: string
    description: string
    prompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionSymbolCreateOrConnectWithoutUserInput = {
    where: ActionSymbolWhereUniqueInput
    create: XOR<ActionSymbolCreateWithoutUserInput, ActionSymbolUncheckedCreateWithoutUserInput>
  }

  export type ActionSymbolCreateManyUserInputEnvelope = {
    data: ActionSymbolCreateManyUserInput | ActionSymbolCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ActionConfigurationCreateWithoutUserInput = {
    id?: string
    name: string
    description: string
    forwardTemplate?: string
    rotateTemplate?: string
    jumpTemplate?: string
    flyTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionConfigurationUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description: string
    forwardTemplate?: string
    rotateTemplate?: string
    jumpTemplate?: string
    flyTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionConfigurationCreateOrConnectWithoutUserInput = {
    where: ActionConfigurationWhereUniqueInput
    create: XOR<ActionConfigurationCreateWithoutUserInput, ActionConfigurationUncheckedCreateWithoutUserInput>
  }

  export type ActionConfigurationCreateManyUserInputEnvelope = {
    data: ActionConfigurationCreateManyUserInput | ActionConfigurationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MultimediaAPIConfigCreateWithoutUserInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MultimediaAPIConfigUncheckedCreateWithoutUserInput = {
    id?: string
    config: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MultimediaAPIConfigCreateOrConnectWithoutUserInput = {
    where: MultimediaAPIConfigWhereUniqueInput
    create: XOR<MultimediaAPIConfigCreateWithoutUserInput, MultimediaAPIConfigUncheckedCreateWithoutUserInput>
  }

  export type TransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutUserInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: IntFilter<"Transaction"> | number
    userId?: IntFilter<"Transaction"> | number
    type?: StringFilter<"Transaction"> | string
    amount?: FloatFilter<"Transaction"> | number
    description?: StringNullableFilter<"Transaction"> | string | null
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type SymbolUpsertWithWhereUniqueWithoutUserInput = {
    where: SymbolWhereUniqueInput
    update: XOR<SymbolUpdateWithoutUserInput, SymbolUncheckedUpdateWithoutUserInput>
    create: XOR<SymbolCreateWithoutUserInput, SymbolUncheckedCreateWithoutUserInput>
  }

  export type SymbolUpdateWithWhereUniqueWithoutUserInput = {
    where: SymbolWhereUniqueInput
    data: XOR<SymbolUpdateWithoutUserInput, SymbolUncheckedUpdateWithoutUserInput>
  }

  export type SymbolUpdateManyWithWhereWithoutUserInput = {
    where: SymbolScalarWhereInput
    data: XOR<SymbolUpdateManyMutationInput, SymbolUncheckedUpdateManyWithoutUserInput>
  }

  export type SymbolScalarWhereInput = {
    AND?: SymbolScalarWhereInput | SymbolScalarWhereInput[]
    OR?: SymbolScalarWhereInput[]
    NOT?: SymbolScalarWhereInput | SymbolScalarWhereInput[]
    id?: StringFilter<"Symbol"> | string
    userId?: IntFilter<"Symbol"> | number
    icon?: StringFilter<"Symbol"> | string
    name?: StringFilter<"Symbol"> | string
    description?: StringFilter<"Symbol"> | string
    createdAt?: DateTimeFilter<"Symbol"> | Date | string
    updatedAt?: DateTimeFilter<"Symbol"> | Date | string
  }

  export type QuickStoryboardConfigUpsertWithWhereUniqueWithoutUserInput = {
    where: QuickStoryboardConfigWhereUniqueInput
    update: XOR<QuickStoryboardConfigUpdateWithoutUserInput, QuickStoryboardConfigUncheckedUpdateWithoutUserInput>
    create: XOR<QuickStoryboardConfigCreateWithoutUserInput, QuickStoryboardConfigUncheckedCreateWithoutUserInput>
  }

  export type QuickStoryboardConfigUpdateWithWhereUniqueWithoutUserInput = {
    where: QuickStoryboardConfigWhereUniqueInput
    data: XOR<QuickStoryboardConfigUpdateWithoutUserInput, QuickStoryboardConfigUncheckedUpdateWithoutUserInput>
  }

  export type QuickStoryboardConfigUpdateManyWithWhereWithoutUserInput = {
    where: QuickStoryboardConfigScalarWhereInput
    data: XOR<QuickStoryboardConfigUpdateManyMutationInput, QuickStoryboardConfigUncheckedUpdateManyWithoutUserInput>
  }

  export type QuickStoryboardConfigScalarWhereInput = {
    AND?: QuickStoryboardConfigScalarWhereInput | QuickStoryboardConfigScalarWhereInput[]
    OR?: QuickStoryboardConfigScalarWhereInput[]
    NOT?: QuickStoryboardConfigScalarWhereInput | QuickStoryboardConfigScalarWhereInput[]
    id?: StringFilter<"QuickStoryboardConfig"> | string
    userId?: IntFilter<"QuickStoryboardConfig"> | number
    name?: StringFilter<"QuickStoryboardConfig"> | string
    description?: StringFilter<"QuickStoryboardConfig"> | string
    threeViewTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    multiGridTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    styleComparisonTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    narrativeProgressionTemplate?: StringFilter<"QuickStoryboardConfig"> | string
    createdAt?: DateTimeFilter<"QuickStoryboardConfig"> | Date | string
    updatedAt?: DateTimeFilter<"QuickStoryboardConfig"> | Date | string
  }

  export type GenerationHistoryUpsertWithWhereUniqueWithoutUserInput = {
    where: GenerationHistoryWhereUniqueInput
    update: XOR<GenerationHistoryUpdateWithoutUserInput, GenerationHistoryUncheckedUpdateWithoutUserInput>
    create: XOR<GenerationHistoryCreateWithoutUserInput, GenerationHistoryUncheckedCreateWithoutUserInput>
  }

  export type GenerationHistoryUpdateWithWhereUniqueWithoutUserInput = {
    where: GenerationHistoryWhereUniqueInput
    data: XOR<GenerationHistoryUpdateWithoutUserInput, GenerationHistoryUncheckedUpdateWithoutUserInput>
  }

  export type GenerationHistoryUpdateManyWithWhereWithoutUserInput = {
    where: GenerationHistoryScalarWhereInput
    data: XOR<GenerationHistoryUpdateManyMutationInput, GenerationHistoryUncheckedUpdateManyWithoutUserInput>
  }

  export type GenerationHistoryScalarWhereInput = {
    AND?: GenerationHistoryScalarWhereInput | GenerationHistoryScalarWhereInput[]
    OR?: GenerationHistoryScalarWhereInput[]
    NOT?: GenerationHistoryScalarWhereInput | GenerationHistoryScalarWhereInput[]
    id?: StringFilter<"GenerationHistory"> | string
    userId?: IntFilter<"GenerationHistory"> | number
    type?: StringFilter<"GenerationHistory"> | string
    prompt?: StringFilter<"GenerationHistory"> | string
    images?: StringNullableListFilter<"GenerationHistory">
    metadata?: JsonFilter<"GenerationHistory">
    createdAt?: DateTimeFilter<"GenerationHistory"> | Date | string
  }

  export type ActionSymbolUpsertWithWhereUniqueWithoutUserInput = {
    where: ActionSymbolWhereUniqueInput
    update: XOR<ActionSymbolUpdateWithoutUserInput, ActionSymbolUncheckedUpdateWithoutUserInput>
    create: XOR<ActionSymbolCreateWithoutUserInput, ActionSymbolUncheckedCreateWithoutUserInput>
  }

  export type ActionSymbolUpdateWithWhereUniqueWithoutUserInput = {
    where: ActionSymbolWhereUniqueInput
    data: XOR<ActionSymbolUpdateWithoutUserInput, ActionSymbolUncheckedUpdateWithoutUserInput>
  }

  export type ActionSymbolUpdateManyWithWhereWithoutUserInput = {
    where: ActionSymbolScalarWhereInput
    data: XOR<ActionSymbolUpdateManyMutationInput, ActionSymbolUncheckedUpdateManyWithoutUserInput>
  }

  export type ActionSymbolScalarWhereInput = {
    AND?: ActionSymbolScalarWhereInput | ActionSymbolScalarWhereInput[]
    OR?: ActionSymbolScalarWhereInput[]
    NOT?: ActionSymbolScalarWhereInput | ActionSymbolScalarWhereInput[]
    id?: StringFilter<"ActionSymbol"> | string
    userId?: IntFilter<"ActionSymbol"> | number
    name?: StringFilter<"ActionSymbol"> | string
    icon?: StringFilter<"ActionSymbol"> | string
    description?: StringFilter<"ActionSymbol"> | string
    prompt?: StringFilter<"ActionSymbol"> | string
    createdAt?: DateTimeFilter<"ActionSymbol"> | Date | string
    updatedAt?: DateTimeFilter<"ActionSymbol"> | Date | string
  }

  export type ActionConfigurationUpsertWithWhereUniqueWithoutUserInput = {
    where: ActionConfigurationWhereUniqueInput
    update: XOR<ActionConfigurationUpdateWithoutUserInput, ActionConfigurationUncheckedUpdateWithoutUserInput>
    create: XOR<ActionConfigurationCreateWithoutUserInput, ActionConfigurationUncheckedCreateWithoutUserInput>
  }

  export type ActionConfigurationUpdateWithWhereUniqueWithoutUserInput = {
    where: ActionConfigurationWhereUniqueInput
    data: XOR<ActionConfigurationUpdateWithoutUserInput, ActionConfigurationUncheckedUpdateWithoutUserInput>
  }

  export type ActionConfigurationUpdateManyWithWhereWithoutUserInput = {
    where: ActionConfigurationScalarWhereInput
    data: XOR<ActionConfigurationUpdateManyMutationInput, ActionConfigurationUncheckedUpdateManyWithoutUserInput>
  }

  export type ActionConfigurationScalarWhereInput = {
    AND?: ActionConfigurationScalarWhereInput | ActionConfigurationScalarWhereInput[]
    OR?: ActionConfigurationScalarWhereInput[]
    NOT?: ActionConfigurationScalarWhereInput | ActionConfigurationScalarWhereInput[]
    id?: StringFilter<"ActionConfiguration"> | string
    userId?: IntFilter<"ActionConfiguration"> | number
    name?: StringFilter<"ActionConfiguration"> | string
    description?: StringFilter<"ActionConfiguration"> | string
    forwardTemplate?: StringFilter<"ActionConfiguration"> | string
    rotateTemplate?: StringFilter<"ActionConfiguration"> | string
    jumpTemplate?: StringFilter<"ActionConfiguration"> | string
    flyTemplate?: StringFilter<"ActionConfiguration"> | string
    createdAt?: DateTimeFilter<"ActionConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"ActionConfiguration"> | Date | string
  }

  export type MultimediaAPIConfigUpsertWithoutUserInput = {
    update: XOR<MultimediaAPIConfigUpdateWithoutUserInput, MultimediaAPIConfigUncheckedUpdateWithoutUserInput>
    create: XOR<MultimediaAPIConfigCreateWithoutUserInput, MultimediaAPIConfigUncheckedCreateWithoutUserInput>
    where?: MultimediaAPIConfigWhereInput
  }

  export type MultimediaAPIConfigUpdateToOneWithWhereWithoutUserInput = {
    where?: MultimediaAPIConfigWhereInput
    data: XOR<MultimediaAPIConfigUpdateWithoutUserInput, MultimediaAPIConfigUncheckedUpdateWithoutUserInput>
  }

  export type MultimediaAPIConfigUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MultimediaAPIConfigUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    config?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutTransactionsInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    symbols?: SymbolCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    symbols?: SymbolUncheckedCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryUncheckedCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolUncheckedCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationUncheckedCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
  }

  export type UserUpsertWithoutTransactionsInput = {
    update: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserUpdateWithoutTransactionsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    symbols?: SymbolUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    symbols?: SymbolUncheckedUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUncheckedUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutSymbolsInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSymbolsInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryUncheckedCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolUncheckedCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationUncheckedCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSymbolsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSymbolsInput, UserUncheckedCreateWithoutSymbolsInput>
  }

  export type UserUpsertWithoutSymbolsInput = {
    update: XOR<UserUpdateWithoutSymbolsInput, UserUncheckedUpdateWithoutSymbolsInput>
    create: XOR<UserCreateWithoutSymbolsInput, UserUncheckedCreateWithoutSymbolsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSymbolsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSymbolsInput, UserUncheckedUpdateWithoutSymbolsInput>
  }

  export type UserUpdateWithoutSymbolsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSymbolsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUncheckedUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutQuickStoryboardConfigsInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
    symbols?: SymbolCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutQuickStoryboardConfigsInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    symbols?: SymbolUncheckedCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryUncheckedCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolUncheckedCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationUncheckedCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutQuickStoryboardConfigsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutQuickStoryboardConfigsInput, UserUncheckedCreateWithoutQuickStoryboardConfigsInput>
  }

  export type UserUpsertWithoutQuickStoryboardConfigsInput = {
    update: XOR<UserUpdateWithoutQuickStoryboardConfigsInput, UserUncheckedUpdateWithoutQuickStoryboardConfigsInput>
    create: XOR<UserCreateWithoutQuickStoryboardConfigsInput, UserUncheckedCreateWithoutQuickStoryboardConfigsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutQuickStoryboardConfigsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutQuickStoryboardConfigsInput, UserUncheckedUpdateWithoutQuickStoryboardConfigsInput>
  }

  export type UserUpdateWithoutQuickStoryboardConfigsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    symbols?: SymbolUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutQuickStoryboardConfigsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    symbols?: SymbolUncheckedUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUncheckedUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutGenerationHistoryInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
    symbols?: SymbolCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGenerationHistoryInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    symbols?: SymbolUncheckedCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolUncheckedCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationUncheckedCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGenerationHistoryInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGenerationHistoryInput, UserUncheckedCreateWithoutGenerationHistoryInput>
  }

  export type UserUpsertWithoutGenerationHistoryInput = {
    update: XOR<UserUpdateWithoutGenerationHistoryInput, UserUncheckedUpdateWithoutGenerationHistoryInput>
    create: XOR<UserCreateWithoutGenerationHistoryInput, UserUncheckedCreateWithoutGenerationHistoryInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGenerationHistoryInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGenerationHistoryInput, UserUncheckedUpdateWithoutGenerationHistoryInput>
  }

  export type UserUpdateWithoutGenerationHistoryInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    symbols?: SymbolUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGenerationHistoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    symbols?: SymbolUncheckedUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUncheckedUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutActionSymbolsInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
    symbols?: SymbolCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutActionSymbolsInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    symbols?: SymbolUncheckedCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryUncheckedCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationUncheckedCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutActionSymbolsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActionSymbolsInput, UserUncheckedCreateWithoutActionSymbolsInput>
  }

  export type UserUpsertWithoutActionSymbolsInput = {
    update: XOR<UserUpdateWithoutActionSymbolsInput, UserUncheckedUpdateWithoutActionSymbolsInput>
    create: XOR<UserCreateWithoutActionSymbolsInput, UserUncheckedCreateWithoutActionSymbolsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActionSymbolsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActionSymbolsInput, UserUncheckedUpdateWithoutActionSymbolsInput>
  }

  export type UserUpdateWithoutActionSymbolsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    symbols?: SymbolUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActionSymbolsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    symbols?: SymbolUncheckedUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutActionConfigurationsInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
    symbols?: SymbolCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutActionConfigurationsInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    symbols?: SymbolUncheckedCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryUncheckedCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolUncheckedCreateNestedManyWithoutUserInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutActionConfigurationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActionConfigurationsInput, UserUncheckedCreateWithoutActionConfigurationsInput>
  }

  export type UserUpsertWithoutActionConfigurationsInput = {
    update: XOR<UserUpdateWithoutActionConfigurationsInput, UserUncheckedUpdateWithoutActionConfigurationsInput>
    create: XOR<UserCreateWithoutActionConfigurationsInput, UserUncheckedCreateWithoutActionConfigurationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActionConfigurationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActionConfigurationsInput, UserUncheckedUpdateWithoutActionConfigurationsInput>
  }

  export type UserUpdateWithoutActionConfigurationsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    symbols?: SymbolUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActionConfigurationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    symbols?: SymbolUncheckedUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUncheckedUpdateManyWithoutUserNestedInput
    multimediaAPIConfig?: MultimediaAPIConfigUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutMultimediaAPIConfigInput = {
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
    symbols?: SymbolCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMultimediaAPIConfigInput = {
    id?: number
    username: string
    email: string
    password: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    symbols?: SymbolUncheckedCreateNestedManyWithoutUserInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedCreateNestedManyWithoutUserInput
    generationHistory?: GenerationHistoryUncheckedCreateNestedManyWithoutUserInput
    actionSymbols?: ActionSymbolUncheckedCreateNestedManyWithoutUserInput
    actionConfigurations?: ActionConfigurationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMultimediaAPIConfigInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMultimediaAPIConfigInput, UserUncheckedCreateWithoutMultimediaAPIConfigInput>
  }

  export type UserUpsertWithoutMultimediaAPIConfigInput = {
    update: XOR<UserUpdateWithoutMultimediaAPIConfigInput, UserUncheckedUpdateWithoutMultimediaAPIConfigInput>
    create: XOR<UserCreateWithoutMultimediaAPIConfigInput, UserUncheckedCreateWithoutMultimediaAPIConfigInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMultimediaAPIConfigInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMultimediaAPIConfigInput, UserUncheckedUpdateWithoutMultimediaAPIConfigInput>
  }

  export type UserUpdateWithoutMultimediaAPIConfigInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    symbols?: SymbolUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMultimediaAPIConfigInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    symbols?: SymbolUncheckedUpdateManyWithoutUserNestedInput
    quickStoryboardConfigs?: QuickStoryboardConfigUncheckedUpdateManyWithoutUserNestedInput
    generationHistory?: GenerationHistoryUncheckedUpdateManyWithoutUserNestedInput
    actionSymbols?: ActionSymbolUncheckedUpdateManyWithoutUserNestedInput
    actionConfigurations?: ActionConfigurationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TransactionCreateManyUserInput = {
    id?: number
    type: string
    amount: number
    description?: string | null
    createdAt?: Date | string
  }

  export type SymbolCreateManyUserInput = {
    id?: string
    icon: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QuickStoryboardConfigCreateManyUserInput = {
    id?: string
    name: string
    description: string
    threeViewTemplate?: string
    multiGridTemplate?: string
    styleComparisonTemplate?: string
    narrativeProgressionTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GenerationHistoryCreateManyUserInput = {
    id?: string
    type: string
    prompt: string
    images?: GenerationHistoryCreateimagesInput | string[]
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ActionSymbolCreateManyUserInput = {
    id?: string
    name: string
    icon: string
    description: string
    prompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionConfigurationCreateManyUserInput = {
    id?: string
    name: string
    description: string
    forwardTemplate?: string
    rotateTemplate?: string
    jumpTemplate?: string
    flyTemplate?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SymbolUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuickStoryboardConfigUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    threeViewTemplate?: StringFieldUpdateOperationsInput | string
    multiGridTemplate?: StringFieldUpdateOperationsInput | string
    styleComparisonTemplate?: StringFieldUpdateOperationsInput | string
    narrativeProgressionTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuickStoryboardConfigUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    threeViewTemplate?: StringFieldUpdateOperationsInput | string
    multiGridTemplate?: StringFieldUpdateOperationsInput | string
    styleComparisonTemplate?: StringFieldUpdateOperationsInput | string
    narrativeProgressionTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuickStoryboardConfigUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    threeViewTemplate?: StringFieldUpdateOperationsInput | string
    multiGridTemplate?: StringFieldUpdateOperationsInput | string
    styleComparisonTemplate?: StringFieldUpdateOperationsInput | string
    narrativeProgressionTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationHistoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    images?: GenerationHistoryUpdateimagesInput | string[]
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationHistoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    images?: GenerationHistoryUpdateimagesInput | string[]
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GenerationHistoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    images?: GenerationHistoryUpdateimagesInput | string[]
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionSymbolUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionSymbolUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionSymbolUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    icon?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    prompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionConfigurationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    forwardTemplate?: StringFieldUpdateOperationsInput | string
    rotateTemplate?: StringFieldUpdateOperationsInput | string
    jumpTemplate?: StringFieldUpdateOperationsInput | string
    flyTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionConfigurationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    forwardTemplate?: StringFieldUpdateOperationsInput | string
    rotateTemplate?: StringFieldUpdateOperationsInput | string
    jumpTemplate?: StringFieldUpdateOperationsInput | string
    flyTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionConfigurationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    forwardTemplate?: StringFieldUpdateOperationsInput | string
    rotateTemplate?: StringFieldUpdateOperationsInput | string
    jumpTemplate?: StringFieldUpdateOperationsInput | string
    flyTemplate?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TransactionDefaultArgs instead
     */
    export type TransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TransactionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SymbolDefaultArgs instead
     */
    export type SymbolArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SymbolDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuickStoryboardConfigDefaultArgs instead
     */
    export type QuickStoryboardConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuickStoryboardConfigDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GenerationHistoryDefaultArgs instead
     */
    export type GenerationHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GenerationHistoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActionSymbolDefaultArgs instead
     */
    export type ActionSymbolArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActionSymbolDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ActionConfigurationDefaultArgs instead
     */
    export type ActionConfigurationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ActionConfigurationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MultimediaAPIConfigDefaultArgs instead
     */
    export type MultimediaAPIConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MultimediaAPIConfigDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}