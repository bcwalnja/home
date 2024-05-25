import csv
import csv

# here's a sample data item:
    # <data_item>
    #     <entity_id>1190799</entity_id>
    #     <entity_type_id>4</entity_type_id>
    #     <attribute_set_id>44</attribute_set_id>
    #     <type_id>simple</type_id>
    #     <sku>1147670</sku>
    #     <has_options>0</has_options>
    #     <required_options>0</required_options>
    #     <created_at>2022-08-11 20:12:17</created_at>
    #     <updated_at>2023-01-03 15:16:44.000000</updated_at>
    #     <ecomdev_activation_date />
    #     <ecomdev_expiry_date />
    #     <name>Admiral 3.5 Cu. Ft. White Top Load Washer</name>
    #     <meta_description>Achieve a finish that leaves your clothes as bright and clean as this
    #         top-load Admiral washer design.</meta_description>
    #     <image>/8/6/86ad84eb-2f0f-4f8c-99ba-419822385e3d.jpg</image>
    #     <small_image>/8/6/86ad84eb-2f0f-4f8c-99ba-419822385e3d.jpg</small_image>
    #     <thumbnail>/8/6/86ad84eb-2f0f-4f8c-99ba-419822385e3d.jpg</thumbnail>
    #     <url_key>admiral-35-cu-ft-white-top-load-washer-atw4516mw-1147670</url_key>
    #     <msrp_enabled>No</msrp_enabled>
    #     <msrp_display_actual_price_type>In Cart</msrp_display_actual_price_type>
    #     <upccode />
    #     <model_number>ATW4516MW</model_number>
    #     <sort_weight>505</sort_weight>
    #     <display_price>1</display_price>
    #     <display_add_to_cart>0</display_add_to_cart>
    #     <display_request_a_quote>1</display_request_a_quote>
    #     <pre_selected_add_on />
    #     <msrp>629</msrp>
    #     <manufacturer>Admiral</manufacturer>
    #     <poa>Available in Store Only</poa>
    #     <energy_star_qualified>No</energy_star_qualified>
    #     <collection_name />
    #     <short_description>Achieve a finish that leaves your clothes as bright and clean as this
    #         top-load Admiral washer design.</short_description>
    #     <color>White</color>
    #     <brandsource_point_of_sale_marketing>
    #         <data_item>Available in Lancaster</data_item>
    #         <data_item>Clearance</data_item>
    #     </brandsource_point_of_sale_marketing>
    #     <product_flags>
    #         <data_item>
    #             <position>4</position>
    #             <text>
    #                 <line1>REDUCED</line1>
    #                 <line2 />
    #             </text>
    #             <color>red</color>
    #             <textColor>white</textColor>
    #             <imageURL />
    #             <flagURL />
    #             <icon />
    #             <visible>1</visible>
    #             <languageId>1</languageId>
    #         </data_item>
    #     </product_flags>
    #     <promotion />
    #     <product_features>
    #         <data_item>
    #             <Type>Paragraph</Type>
    #             <Description>You only have time for things to work correctly the first time. Take
    #                 confidence in the Deep Water wash option and the wash-action agitator; be sure
    #                 that even heavy loads will always come out clean and fresh. The large-capacity
    #                 tub is porcelain and will protect your most delicate linens and garments from
    #                 snagging during wash cycles. Forget that one shirt? Wearing it? No worries, with
    #                 the Late Lid Lock for last-minute additions—on laundry day, everyone deserves
    #                 some slack.</Description>
    #             <Ordinal>0</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>Wash-Action agitator</Description>
    #             <Ordinal>1</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>Large-capacity, porcelain tub</Description>
    #             <Ordinal>2</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>Late Lid Lock keeps lid free until spin cycle</Description>
    #             <Ordinal>3</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>Deep Water wash option adds water for extra-large loads</Description>
    #             <Ordinal>4</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>Delicate cycles for precious items</Description>
    #             <Ordinal>5</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>8 wash cycles</Description>
    #             <Ordinal>6</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>5 temperature settings</Description>
    #             <Ordinal>7</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>Extra rinse option for the most stubborn stains</Description>
    #             <Ordinal>8</Ordinal>
    #         </data_item>
    #         <data_item>
    #             <Type>Bullet</Type>
    #             <Description>Proudly made in the USA</Description>
    #             <Ordinal>9</Ordinal>
    #         </data_item>
    #     </product_features>
    #     <simple_attributes>
    #         <data_item>
    #             <groupName>Certifications</groupName>
    #             <attributes>
    #                 <data_item>
    #                     <name>Kilowatt Hrs. per Year:</name>
    #                     <value>162</value>
    #                 </data_item>
    #             </attributes>
    #         </data_item>
    #         <data_item>
    #             <groupName>Display</groupName>
    #             <attributes>
    #                 <data_item>
    #                     <name>Cycle Status Light:</name>
    #                     <value>Yes</value>
    #                 </data_item>
    #                 <data_item>
    #                     <name>Controls:</name>
    #                     <value>Mechanical</value>
    #                 </data_item>
    #             </attributes>
    #         </data_item>
    #         <data_item>
    #             <groupName>General Features</groupName>
    #             <attributes>
    #                 <data_item>
    #                     <name>Bleach Dispenser:</name>
    #                     <value>Yes</value>
    #                 </data_item>
    #                 <data_item>
    #                     <name>Water Temperature(s):</name>
    #                     <value>5</value>
    #                 </data_item>
    #                 <data_item>
    #                     <name>Washer Cycle Selections:</name>
    #                     <value>Casual , Delicates , Bulky/Sheets , Normal , Deep Water Wash , Drain
    #                         & Spin , Rinse & Spin , Clean Washer with affresh</value>
    #                 </data_item>
    #             </attributes>
    #         </data_item>
    #     </simple_attributes>
    #     <custom_columns>
    #         <data_item>
    #             <WebsiteTitle>Location:</WebsiteTitle>
    #             <Value>Lancaster</Value>
    #         </data_item>
    #     </custom_columns>
    #     <rebates_json />
    #     <videos_json />
    #     <wistia_videos />
    #     <is_salable>1</is_salable>
    #     <cross_sell_products>
    #         <data_item>
    #             <entity_id>470385</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>386996</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-03-16 20:19:29</created_at>
    #             <updated_at>2023-08-01 16:36:24.000000</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658873</link_id>
    #             <position>0</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>470635</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>387544</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-03-17 16:38:04</created_at>
    #             <updated_at>2024-01-23 19:18:34.000000</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658874</link_id>
    #             <position>1</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>471060</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>386681</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-03-18 18:56:42</created_at>
    #             <updated_at>2022-09-21 06:45:23.655623</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658875</link_id>
    #             <position>2</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>471062</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>386744</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-03-18 18:56:47</created_at>
    #             <updated_at>2022-09-21 06:45:23.751468</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658876</link_id>
    #             <position>3</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>664883</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>609644</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-12-10 17:38:02</created_at>
    #             <updated_at>2022-09-21 08:38:47.153862</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658877</link_id>
    #             <position>4</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>664886</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>609647</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-12-10 17:48:02</created_at>
    #             <updated_at>2022-09-21 08:38:47.211192</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658878</link_id>
    #             <position>5</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>664887</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>609648</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-12-10 17:48:05</created_at>
    #             <updated_at>2022-09-21 08:38:47.238841</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658880</link_id>
    #             <position>6</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>664888</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>609649</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-12-10 17:48:05</created_at>
    #             <updated_at>2022-09-21 08:38:47.267015</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658882</link_id>
    #             <position>7</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #         <data_item>
    #             <entity_id>664889</entity_id>
    #             <entity_type_id>4</entity_type_id>
    #             <attribute_set_id>437</attribute_set_id>
    #             <type_id>simple</type_id>
    #             <sku>609650</sku>
    #             <has_options>0</has_options>
    #             <required_options>0</required_options>
    #             <created_at>2020-12-10 17:48:05</created_at>
    #             <updated_at>2022-09-21 08:38:47.295336</updated_at>
    #             <ecomdev_activation_date />
    #             <ecomdev_expiry_date />
    #             <link_id>90658884</link_id>
    #             <position>8</position>
    #             <is_salable>1</is_salable>
    #             <stock_item>
    #                 <is_in_stock>1</is_in_stock>
    #             </stock_item>
    #         </data_item>
    #     </cross_sell_products>
    #     <outlet_products />
    #     <discount>154</discount>
    #     <discount_formatted>$154.00</discount_formatted>
    #     <discount_instant_savings>0</discount_instant_savings>
    #     <discount_instant_savings_formatted>$0.00</discount_instant_savings_formatted>
    #     <instant_savings_to_date />
    #     <discount_consumer_rebate>0</discount_consumer_rebate>
    #     <discount_consumer_rebate_formatted>$0.00</discount_consumer_rebate_formatted>
    #     <consumer_rebate_to_date />
    #     <regular_price_with_tax>629</regular_price_with_tax>
    #     <regular_price_with_tax_formatted>$629.00</regular_price_with_tax_formatted>
    #     <regular_price_without_tax>629</regular_price_without_tax>
    #     <regular_price_without_tax_formatted>$629.00</regular_price_without_tax_formatted>
    #     <final_price_with_tax>475</final_price_with_tax>
    #     <final_price_with_tax_formatted>$475.00</final_price_with_tax_formatted>
    #     <final_price_without_tax>475</final_price_without_tax>
    #     <final_price_without_tax_formatted>$475.00</final_price_without_tax_formatted>
    #     <image_url>
    #         <normal>
    #             https://d12mivgeuoigbq.cloudfront.net/magento-media/catalog/product/8/6/86ad84eb-2f0f-4f8c-99ba-419822385e3d.jpg?w=640</normal>
    #         <small>
    #             https://d12mivgeuoigbq.cloudfront.net/magento-media/catalog/product/8/6/86ad84eb-2f0f-4f8c-99ba-419822385e3d.jpg?w=240</small>
    #         <thumbnail>
    #             https://d12mivgeuoigbq.cloudfront.net/magento-media/catalog/product/8/6/86ad84eb-2f0f-4f8c-99ba-419822385e3d.jpg?w=160</thumbnail>
    #     </image_url>
    #     <reviews_count>0</reviews_count>
    #     <reviews_rating>0</reviews_rating>
    #     <location_inventory />
    #     <promotions />
    # </data_item>

# take the xml from products.xml and convert it to csv

import xml.etree.ElementTree as ET

try:
    tree = ET.parse('products.xml')
    root = tree.getroot()
except ET.ParseError as e:
    print(f"Error parsing XML file: {e}")
    exit(1)
root = tree.getroot()

# Open the CSV file for writing
with open('products.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)

    # Write the header row
    writer.writerow(['entity_id', 'entity_type_id', 'attribute_set_id', 'type_id', 'sku', 'has_options', 'required_options', 'created_at', 'updated_at', 'ecomdev_activation_date', 'ecomdev_expiry_date', 'link_id', 'position', 'is_salable', 'is_in_stock'])

    # Iterate over the data items in the XML
    for data_item in root.findall('data_item'):
        # Extract the values from the XML
        entity_id = data_item.find('entity_id').text
        entity_type_id = data_item.find('entity_type_id').text
        attribute_set_id = data_item.find('attribute_set_id').text
        type_id = data_item.find('type_id').text
        sku = data_item.find('sku').text
        has_options = data_item.find('has_options').text
        required_options = data_item.find('required_options').text
        created_at = data_item.find('created_at').text
        updated_at = data_item.find('updated_at').text
        ecomdev_activation_date = data_item.find('ecomdev_activation_date').text
        ecomdev_expiry_date = data_item.find('ecomdev_expiry_date').text
        link_id = data_item.find('link_id').text
        position = data_item.find('position').text
        is_salable = data_item.find('is_salable').text
        is_in_stock = data_item.find('stock_item/is_in_stock').text

        # Write the values to the CSV file
        writer.writerow([entity_id, entity_type_id, attribute_set_id, type_id, sku, has_options, required_options, created_at, updated_at, ecomdev_activation_date, ecomdev_expiry_date, link_id, position, is_salable, is_in_stock])

print("Conversion complete. CSV file created.")