/*  CSE 154 Homework 7: Pokedex 2
    Anastasia Erofeeva
    05/23/2017
    Section: AH
    TA: Melissa Medsker
    This is a SQL file for the "Pokedex 2" assignment, 
    that sets up the Pokedex table. */

CREATE TABLE IF NOT EXISTS Pokedex(
    name VARCHAR(20) PRIMARY KEY,
    nickname VARCHAR(20),
    datefound DATETIME
);