module.exports = {
  mySQLKeys: {
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "project2_db"
  }
};







// CREATE TABLE IF NOT EXISTS `users` (
//   `user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
//   `username` VARCHAR(256) NOT NULL,
//   `email` VARCHAR(256) NOT NULL,
//   `password` VARCHAR(256) NOT NULL,
//   PRIMARY KEY(`user_id`),
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// CREATE TABLE IF NOT EXISTS `relationship` (
//   `user_one_id` INT(10) UNSIGNED NOT NULL,
//   `user_two_id` INT(10) UNSIGNED NOT NULL,
//   `status` TINYINT(3) UNSIGNED NOT NULL DEFAULT '0',
//   `action_user_id` INT(10) UNSIGNED NOT NULL,
//   FOREIGN KEY (`user_one_id`) REFERENCES users(`user_id`),
//   FOREIGN KEY (`user_two_id`) REFERENCES users(`user_id`),
//   FOREIGN KEY (`action_user_id`) REFERENCES users(`user_id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// ALTER TABLE `relationship`
// ADD UNIQUE KEY `unique_users_id` (`user_one_id`,`user_two_id`);

// INSERT INTO `users` (`user_id`, `username`, `email`, `password`) VALUES
// (1, 'user1', 'user1@gmail.com', sha2('password', 256)),
// (2, 'user2', 'user2@gmail.com', sha2('password', 256)),
// (3, 'user3', 'user3@gmail.com', sha2('password', 256)),
// (4, 'user4', 'user4@gmail.com', sha2('password', 256)),
// (5, 'user5', 'user5@gmail.com', sha2('password', 256)),
// (6, 'user6', 'user6@gmail.com', sha2('password', 256));

// INSERT INTO `relationship` (`user_one_id`, `user_two_id`, `status`, `action_user_id`) VALUES
// (1, 2, 1, 1),
// (1, 3, 1, 3),
// (1, 4, 1, 4),
// (1, 5, 0, 5),
// (1, 6, 3, 1),
// (2, 3, 1, 2),
// (2, 4, 1, 4),
// (3, 5, 1, 3),
// (1, 7, 0, 1);


// CREATE TABLE `relationship` (
//   `user_one_id` int(10) unsigned NOT NULL,
//   `user_two_id` int(10) unsigned NOT NULL,
//   `status` tinyint(3) unsigned NOT NULL DEFAULT '0',
//   `action_user_id` int(10) unsigned NOT NULL,
//   KEY `user_one_id` (`user_one_id`),
//   KEY `user_two_id` (`user_two_id`),
//   KEY `action_user_id` (`action_user_id`),
//   CONSTRAINT `relationship_ibfk_1` FOREIGN KEY (`user_one_id`) REFERENCES `User` (`id`),
//   CONSTRAINT `relationship_ibfk_2` FOREIGN KEY (`user_two_id`) REFERENCES `User` (`id`),
//   CONSTRAINT `relationship_ibfk_3` FOREIGN KEY (`action_user_id`) REFERENCES `User` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// CREATE TABLE `User` (
//   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
//   `username` varchar(15) NOT NULL DEFAULT '',
//   `email` varchar(100) DEFAULT NULL,
//   `password` binary(60) DEFAULT NULL,
//   `image` varchar(30) NOT NULL DEFAULT 'random.PNG',
//   PRIMARY KEY (`id`),
//   UNIQUE KEY `username` (`username`),
//   UNIQUE KEY `email` (`email`)
// ) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;

// CREATE TABLE `relationship` (
//   `user_one_id` int(10) unsigned NOT NULL,
//   `user_two_id` int(10) unsigned NOT NULL,
//   `status` varchar(10)  NOT NULL DEFAULT 'Pending',
//   `action_user_id` int(10) unsigned NOT NULL,
//   KEY `user_one_id` (`user_one_id`),
//   KEY `user_two_id` (`user_two_id`),
//   KEY `action_user_id` (`action_user_id`),
//   CONSTRAINT `relationship_ibfk_1` FOREIGN KEY (`user_one_id`) REFERENCES `User` (`id`),
//   CONSTRAINT `relationship_ibfk_2` FOREIGN KEY (`user_two_id`) REFERENCES `User` (`id`),
//   CONSTRAINT `relationship_ibfk_3` FOREIGN KEY (`action_user_id`) REFERENCES `User` (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;




// SELECT userA.id AS userA_id, userA.username AS userA_username, userB.id AS userB_id, userB.username AS userB_username, status, action_user_id, userC.username AS action_user_username
// FROM relationship
// INNER JOIN User AS userA ON userA.id = relationship.user_one_id
// INNER JOIN User AS userB ON userB.id = relationship.user_two_id
// INNER JOIN User AS userC ON userC.id = relationship.action_user_id
// WHERE (userA.id = 57 OR userB.id = 57) AND userC.id != 57;
