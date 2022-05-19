/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createExtension('uuid-ossp', {ifNotExists: true})
  pgm.createTable('users', {
    id: { type: 'uuid',
      default: pgm.func('uuid_generate_v4()'),
      notNull: true},
    email: { type: 'text', notNull: true,
      unique: true},
    createdOn: {
      type: 'timestamp without time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })
};

exports.down = pgm => {
  pgm.dropTable('users')
};
