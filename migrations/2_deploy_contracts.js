/*
 * @Description: 
 * @version: 
 * @Author: simpletoyou
 * @Date: 2022-04-24 16:36:02
 * @LastEditors: simpletoyou
 * @LastEditTime: 2022-04-24 16:36:42
 */
var ZombieCore = artifacts.require("ZombieCore");

module.exports = function(deployer) {
  deployer.deploy(ZombieCore);
};
