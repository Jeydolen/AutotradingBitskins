#SELECT * FROM bitskins_csgo.business_query
#INSERT INTO bitskins_csgo.business_query (id,name,query ) values (3, 'Imbricated select query test 2',  'SELECT skin,market_name,price FROM bitskins_csgo.skin_sell_order WHERE skin IN (SELECT id as skin FROM bitskins_csgo.skin WHERE skin_set = 5 AND skin_rarity = 5)');
#SELECT market_name,price FROM bitskins_csgo.skin_sell_order WHERE skin_sell_order.price/10.0  IN

#SELECT A.market_name, SS5SR5.market_name, A.price as A_price, SS5SR5.price as SS5SR5_price 
SELECT * FROM
	( 	
		SELECT price, skin, market_name FROM bitskins_csgo.skin_sell_order WHERE skin_sell_order.skin IN
		(	
			SELECT id FROM bitskins_csgo.skin WHERE skin_set = 5 AND skin_rarity = 4
        ) # Skins with skin_set = 5 && rarity = 5
	) SS5SR5_A
INNER JOIN
	( 	
		SELECT price, skin AS skin_id_B, market_name FROM bitskins_csgo.skin_sell_order WHERE skin_sell_order.skin IN
		(	
			SELECT id FROM bitskins_csgo.skin WHERE skin_set = 5 AND skin_rarity = 5
        ) # Skins with skin_set = 5 && rarity = 5
	) SS5SR5_B
ON SS5SR5_A.price/10 > SS5SR5_B.price;