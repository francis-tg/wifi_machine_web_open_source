#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sqlite3

conn = sqlite3.connect("./database.sqlite3")

def getOne(tablename, columns=[],condition=None):
     # Création d'un curseur pour exécuter des requêtes SQL
    cur = conn.cursor()

    # Construction de la requête SELECT en fonction des colonnes et de la condition WHERE
    if columns:
        columns_str = ', '.join(columns)
        query = "SELECT {} FROM {}".format(columns_str, tablename)
    else:
        query = "SELECT * FROM {}".format(tablename)

    if condition:
        query += " WHERE {}".format(condition)

    # Exécution de la requête
    cur.execute(query)

    # Récupération de la première ligne
    row = cur.fetchone()

    # Fermeture du curseur et de la connexion
    cur.close()
    conn.close()

    return row