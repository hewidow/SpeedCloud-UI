/*
 Navicat Premium Data Transfer

 Source Server         : tx
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : 101.43.111.132:3306
 Source Schema         : speedcloud

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 06/03/2022 21:43:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cloud_file
-- ----------------------------
DROP TABLE IF EXISTS `cloud_file`;
CREATE TABLE `cloud_file`  (
  `file_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `file_md5` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '文件MD5',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小 以字节为单位',
  `file_type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '文件类型',
  `is_banned` tinyint(1) NULL DEFAULT 0 COMMENT '文件封禁',
  PRIMARY KEY (`file_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 378 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '文件存储信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for node
-- ----------------------------
DROP TABLE IF EXISTS `node`;
CREATE TABLE `node`  (
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `node_id` int(11) NOT NULL COMMENT '节点ID',
  `is_directory` tinyint(1) NULL DEFAULT 1 COMMENT '是否为文件夹',
  `parent_id` int(11) NULL DEFAULT NULL COMMENT '父节点ID',
  `full_path` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '全路径',
  `node_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '节点名字,根节点默认为用户名',
  `file_id` int(11) NULL DEFAULT NULL COMMENT '文件ID',
  `is_delete` tinyint(1) NULL DEFAULT 0 COMMENT '是否删除，0：未删除 1：删除\r\n',
  `delete_time` datetime(0) NULL DEFAULT NULL COMMENT '删除时间',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建节点时间',
  `delete_root` tinyint(1) NULL DEFAULT NULL COMMENT '删除时是否为最外层节点',
  PRIMARY KEY (`user_id`, `node_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '文件存储结构' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '账号',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '密码',
  `email` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '邮箱',
  `total_size` bigint(20) NOT NULL DEFAULT 1073741824 COMMENT '总空间',
  `available_size` bigint(20) NOT NULL DEFAULT 1073741824 COMMENT '剩余可用空间',
  `role_name` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'normal' COMMENT '用户角色',
  `banned` int(4) NULL DEFAULT 0 COMMENT '是否被禁止,0:未封禁 1:封禁',
  `theme` int(11) NULL DEFAULT 0 COMMENT '用户主题,交由前端保存用户选择',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
