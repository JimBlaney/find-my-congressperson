define("loc/views/SearchView", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/Deferred",
  "esri/geometry/Point",
  "esri/SpatialReference",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/SearchView.html",
  "dojo/_base/fx",
  "dojo/fx"
], function(
  declare, 
  lang,
  topic,
  Deferred,
  Point,
  SpatialReference,
  _WidgetBase, 
  _TemplatedMixin, 
  _WidgetsInTemplateMixin, 
  template,
  fx1,
  fx2
) {

  var MEMBERS_FIXTURES = [
    { id: 'J000296', name: 'Rep. David W. Jolly' },
    { id: 'A000360', name: 'Sen. Lamar Alexander'},
    { id: 'A000368', name: 'Sen. Kelly Ayotte'},
    { id: 'B001230', name: 'Sen. Tammy Baldwin'},
    { id: 'B001261', name: 'Sen. John A. Barrasso'},
    { id: 'B001265', name: 'Sen. Mark Begich'},
    { id: 'B001267', name: 'Sen. Michael F. Bennet'},
    { id: 'B001277', name: 'Sen. Richard Blumenthal'},
    { id: 'B000575', name: 'Sen. Roy Blunt'},
    { id: 'B001288', name: 'Sen. Cory Anthony Booker'},
    { id: 'B001236', name: 'Sen. John Boozman'},
    { id: 'B000711', name: 'Sen. Barbara Boxer'},
    { id: 'B000944', name: 'Sen. Sherrod Brown'},
    { id: 'B001135', name: 'Sen. Richard M. Burr'},
    { id: 'C000127', name: 'Sen. Maria Cantwell'},
    { id: 'C000141', name: 'Sen. Benjamin L. Cardin'},
    { id: 'C000174', name: 'Sen. Thomas Richard Carper'},
    { id: 'C001070', name: 'Sen. Robert "Bob" P. Casey, Jr.'},
    { id: 'C000286', name: 'Sen. Saxby Chambliss'},
    { id: 'C000542', name: 'Sen. Daniel Ray Coats'},
    { id: 'C000560', name: 'Sen. Thomas A. Coburn'},
    { id: 'C000567', name: 'Sen. Thad Cochran'},
    { id: 'C001035', name: 'Sen. Susan M. Collins'},
    { id: 'C001088', name: 'Sen. Chris Andrew Coons'},
    { id: 'C001071', name: 'Sen. Bob Corker'},
    { id: 'C001056', name: 'Sen. John Cornyn'},
    { id: 'C000880', name: 'Sen. Michael D. Crapo'},
    { id: 'C001098', name: 'Sen. Ted Cruz'},
    { id: 'D000607', name: 'Sen. Joe Donnelly'},
    { id: 'D000563', name: 'Sen. Richard J. Durbin'},
    { id: 'E000285', name: 'Sen. Michael B. Enzi'},
    { id: 'F000062', name: 'Sen. Dianne Feinstein'},
    { id: 'F000463', name: 'Sen. Deb Fischer'},
    { id: 'F000444', name: 'Sen. Jeff Flake'},
    { id: 'F000457', name: 'Sen. Alan "Al" Stuart Franken'},
    { id: 'G000555', name: 'Sen. Kirsten E. Gillibrand'},
    { id: 'G000359', name: 'Sen. Lindsey O. Graham'},
    { id: 'G000386', name: 'Sen. Charles "Chuck" E. Grassley'},
    { id: 'H001049', name: 'Sen. Kay Hagan'},
    { id: 'H000206', name: 'Sen. Thomas "Tom" Harkin'},
    { id: 'H000338', name: 'Sen. Orrin G. Hatch'},
    { id: 'H001046', name: 'Sen. Martin Heinrich'},
    { id: 'H001069', name: 'Sen. Heidi Heitkamp'},
    { id: 'H001041', name: 'Sen. Dean Heller'},
    { id: 'H001042', name: 'Sen. Mazie K. Hirono'},
    { id: 'H001061', name: 'Sen. John Hoeven'},
    { id: 'I000024', name: 'Sen. James "Jim" M. Inhofe'},
    { id: 'I000055', name: 'Sen. John "Johnny" H. Isakson'},
    { id: 'J000291', name: 'Sen. Mike Johanns'},
    { id: 'J000177', name: 'Sen. Tim P. Johnson'},
    { id: 'J000293', name: 'Sen. Ron Johnson'},
    { id: 'K000384', name: 'Sen. Timothy Kaine'},
    { id: 'K000383', name: 'Sen. Angus King'},
    { id: 'K000360', name: 'Sen. Mark Steven Kirk'},
    { id: 'K000367', name: 'Sen. Amy Jean Klobuchar'},
    { id: 'L000550', name: 'Sen. Mary L. Landrieu'},
    { id: 'L000174', name: 'Sen. Patrick J. Leahy'},
    { id: 'L000577', name: 'Sen. Mike Lee'},
    { id: 'L000261', name: 'Sen. Carl Levin'},
    { id: 'M001183', name: 'Sen. Joe Manchin, III'},
    { id: 'M000133', name: 'Sen. Edward "Ed" J. Markey'},
    { id: 'M000303', name: 'Sen. John S. McCain'},
    { id: 'M001170', name: 'Sen. Claire McCaskill'},
    { id: 'M000355', name: 'Sen. Mitch McConnell'},
    { id: 'M000639', name: 'Sen. Robert "Bob" Menéndez'},
    { id: 'M001176', name: 'Sen. Jeff Merkley'},
    { id: 'M000702', name: 'Sen. Barbara A. Mikulski'},
    { id: 'M000934', name: 'Sen. Jerry Moran'},
    { id: 'M001153', name: 'Sen. Lisa A. Murkowski'},
    { id: 'M001169', name: 'Sen. Christopher S. Murphy'},
    { id: 'M001111', name: 'Sen. Patty Murray'},
    { id: 'N000032', name: 'Sen. Bill Nelson'},
    { id: 'P000603', name: 'Sen. Rand Paul'},
    { id: 'P000449', name: 'Sen. Robert "Rob" J. Portman'},
    { id: 'P000590', name: 'Sen. Mark Pryor'},
    { id: 'R000122', name: 'Sen. John "Jack" F. Reed'},
    { id: 'R000146', name: 'Sen. Harry M. Reid'},
    { id: 'R000584', name: 'Sen. James Risch'},
    { id: 'R000307', name: 'Sen. Pat Roberts'},
    { id: 'R000361', name: 'Sen. John "Jay" D. Rockefeller, IV'},
    { id: 'R000595', name: 'Sen. Marco Rubio'},
    { id: 'S000033', name: 'Sen. Bernard "Bernie" Sanders'},
    { id: 'S001194', name: 'Sen. Brian Emanuel Schatz'},
    { id: 'S000148', name: 'Sen. Charles "Chuck" E. Schumer'},
    { id: 'S001184', name: 'Sen. Tim Scott'},
    { id: 'S001141', name: 'Sen. Jefferson "Jeff" B. Sessions'},
    { id: 'S001181', name: 'Sen. Jeanne Shaheen'},
    { id: 'S000320', name: 'Sen. Richard C. Shelby'},
    { id: 'S000770', name: 'Sen. Debbie Ann Stabenow'},
    { id: 'T000464', name: 'Sen. Jon Tester'},
    { id: 'T000250', name: 'Sen. John Thune'},
    { id: 'T000461', name: 'Sen. Patrick "Pat" J. Toomey'},
    { id: 'U000039', name: 'Sen. Tom S. Udall'},
    { id: 'U000038', name: 'Sen. Mark E. Udall'},
    { id: 'V000127', name: 'Sen. David Vitter'},
    { id: 'W000818', name: 'Sen. John E. Walsh'},
    { id: 'W000805', name: 'Sen. Mark Warner'},
    { id: 'W000817', name: 'Sen. Elizabeth Warren'},
    { id: 'W000802', name: 'Sen. Sheldon Whitehouse'},
    { id: 'W000437', name: 'Sen. Roger F. Wicker'},
    { id: 'W000779', name: 'Sen. Ron Wyden'},
    { id: 'A000055', name: 'Rep. Robert B. Aderholt'},
    { id: 'A000367', name: 'Rep. Justin Amash'},
    { id: 'A000369', name: 'Rep. Mark E. Amodei'},
    { id: 'B001256', name: 'Rep. Michele Marie Bachmann'},
    { id: 'B000013', name: 'Rep. Spencer Thomas Bachus, III'},
    { id: 'B001279', name: 'Rep. Ron Barber'},
    { id: 'B001269', name: 'Rep. Lou Barletta'},
    { id: 'B001282', name: 'Rep. Garland "Andy" Barr'},
    { id: 'B001252', name: 'Rep. John Barrow'},
    { id: 'B000213', name: 'Rep. Joe Linus Barton'},
    { id: 'B001270', name: 'Rep. Karen Bass'},
    { id: 'B001281', name: 'Rep. Joyce Beatty'},
    { id: 'B000287', name: 'Rep. Xavier Becerra'},
    { id: 'B001271', name: 'Rep. Dan Benishek'},
    { id: 'B001280', name: 'Rep. Kerry L. Bentivolio'},
    { id: 'B001287', name: 'Rep. Ami Bera'},
    { id: 'B001257', name: 'Rep. Gus M. Bilirakis'},
    { id: 'B001242', name: 'Rep. Timothy H. Bishop'},
    { id: 'B000490', name: 'Rep. Sanford D. Bishop, Jr.'},
    { id: 'B001250', name: 'Rep. Rob Bishop'},
    { id: 'B001273', name: 'Rep. Diane Black'},
    { id: 'B001243', name: 'Rep. Marsha W. Blackburn'},
    { id: 'B000574', name: 'Rep. Earl Blumenauer'},
    { id: 'B000589', name: 'Rep. John A. Boehner'},
    { id: 'B001278', name: 'Rep. Suzanne Bonamici'},
    { id: 'B001245', name: 'Del. Madeleine Z. Bordallo'},
    { id: 'B001255', name: 'Rep. Charles W. Boustany, Jr.'},
    { id: 'B001227', name: 'Rep. Robert A. Brady'},
    { id: 'B000755', name: 'Rep. Kevin P. Brady'},
    { id: 'B001259', name: 'Rep. Bruce L. Braley'},
    { id: 'B001283', name: 'Rep. Jim Bridenstine'},
    { id: 'B001284', name: 'Rep. Susan W. Brooks'},
    { id: 'B001274', name: 'Rep. Mo Brooks'},
    { id: 'B001262', name: 'Rep. Paul C. Broun, Jr.'},
    { id: 'B000911', name: 'Rep. Corrine Brown'},
    { id: 'B001285', name: 'Rep. Julia Brownley'},
    { id: 'B001260', name: 'Rep. Vern Buchanan'},
    { id: 'B001275', name: 'Rep. Larry Bucshon'},
    { id: 'B001248', name: 'Rep. Michael C. Burgess'},
    { id: 'B001286', name: 'Rep. Cheri Bustos'},
    { id: 'B001251', name: 'Rep. George "G.K." Kenneth Butterfield, Jr.'},
    { id: 'B001289', name: 'Rep. Bradley Byrne'},
    { id: 'C000059', name: 'Rep. Ken S. Calvert'},
    { id: 'C000071', name: 'Rep. Dave Lee Camp'},
    { id: 'C001064', name: 'Rep. John Bayard Taylor Campbell, III'},
    { id: 'C001046', name: 'Rep. Eric I. Cantor'},
    { id: 'C001047', name: 'Rep. Shelley Moore Capito'},
    { id: 'C001036', name: 'Rep. Lois Capps'},
    { id: 'C001037', name: 'Rep. Michael E. Capuano'},
    { id: 'C001083', name: 'Rep. John C. Carney'},
    { id: 'C001072', name: 'Rep. André Carson'},
    { id: 'C001051', name: 'Rep. John R. Carter'},
    { id: 'C001090', name: 'Rep. Matthew A. Cartwright'},
    { id: 'C001075', name: 'Rep. Bill Cassidy'},
    { id: 'C001066', name: 'Rep. Kathy Castor'},
    { id: 'C001091', name: 'Rep. Joaquin Castro'},
    { id: 'C000266', name: 'Rep. Steve J. Chabot'},
    { id: 'C001076', name: 'Rep. Jason Chaffetz'},
    { id: 'C000380', name: 'Del. Donna M. Christensen'},
    { id: 'C001080', name: 'Rep. Judy M. Chu'},
    { id: 'C001084', name: 'Rep. David N. Cicilline'},
    { id: 'C001101', name: 'Rep. Katherine M. Clark'},
    { id: 'C001067', name: 'Rep. Yvette D. Clarke'},
    { id: 'C001049', name: 'Rep. Wm. Lacy Clay, Jr.'},
    { id: 'C001061', name: 'Rep. Emanuel Cleaver, II'},
    { id: 'C000537', name: 'Rep. James "Jim" E. Clyburn'},
    { id: 'C000556', name: 'Rep. Howard Coble'},
    { id: 'C001077', name: 'Rep. Mike Coffman'},
    { id: 'C001068', name: 'Rep. Steve Cohen'},
    { id: 'C001053', name: 'Rep. Tom Cole'},
    { id: 'C001093', name: 'Rep. Doug Collins'},
    { id: 'C001092', name: 'Rep. Chris Collins'},
    { id: 'C001062', name: 'Rep. K. Michael Conaway'},
    { id: 'C001078', name: 'Rep. Gerald E. Connolly'},
    { id: 'C000714', name: 'Rep. John Conyers, Jr.'},
    { id: 'C001094', name: 'Rep. Paul Cook'},
    { id: 'C000754', name: 'Rep. Jim Cooper'},
    { id: 'C001059', name: 'Rep. Jim Costa'},
    { id: 'C001095', name: 'Rep. Tom Cotton'},
    { id: 'C001069', name: 'Rep. Joe Courtney'},
    { id: 'C001096', name: 'Rep. Kevin Cramer'},
    { id: 'C001087', name: 'Rep. Eric "Rick" A. Crawford'},
    { id: 'C001045', name: 'Rep. Ander Crenshaw'},
    { id: 'C001038', name: 'Rep. Joseph Crowley'},
    { id: 'C001063', name: 'Rep. Henry Cuellar'},
    { id: 'C001048', name: 'Rep. John Abney Culberson'},
    { id: 'C000984', name: 'Rep. Elijah E. Cummings'},
    { id: 'C001097', name: 'Rep. Tony Cárdenas'},
    { id: 'D000618', name: 'Rep. Steve Daines'},
    { id: 'D000598', name: 'Rep. Susan A. Davis'},
    { id: 'D000619', name: 'Rep. Rodney Davis'},
    { id: 'D000096', name: 'Rep. Danny K. Davis'},
    { id: 'D000191', name: 'Rep. Peter A. DeFazio'},
    { id: 'D000197', name: 'Rep. Diana L. DeGette'},
    { id: 'D000216', name: 'Rep. Rosa L. DeLauro'},
    { id: 'D000621', name: 'Rep. Ron DeSantis'},
    { id: 'D000617', name: 'Rep. Suzan K. DelBene'},
    { id: 'D000620', name: 'Rep. John K. Delaney'},
    { id: 'D000612', name: 'Rep. Jeff Denham'},
    { id: 'D000604', name: 'Rep. Charles W. Dent'},
    { id: 'D000616', name: 'Rep. Scott DesJarlais'},
    { id: 'D000610', name: 'Rep. Theodore E. Deutch'},
    { id: 'D000600', name: 'Rep. Mario Diaz-Balart'},
    { id: 'D000355', name: 'Rep. John D. Dingell'},
    { id: 'D000399', name: 'Rep. Lloyd A. Doggett'},
    { id: 'D000482', name: 'Rep. Michael "Mike" F. Doyle, Jr.'},
    { id: 'D000622', name: 'Rep. Tammy Duckworth'},
    { id: 'D000614', name: 'Rep. Sean P. Duffy'},
    { id: 'D000533', name: 'Rep. John "Jimmy" J. Duncan, Jr.'},
    { id: 'D000615', name: 'Rep. Jeff Duncan'},
    { id: 'E000290', name: 'Rep. Donna F. Edwards'},
    { id: 'E000288', name: 'Rep. Keith Maurice Ellison'},
    { id: 'E000291', name: 'Rep. Renee L. Ellmers'},
    { id: 'E000179', name: 'Rep. Eliot L. Engel'},
    { id: 'E000292', name: 'Rep. William L. Enyart'},
    { id: 'E000215', name: 'Rep. Anna G. Eshoo'},
    { id: 'E000293', name: 'Rep. Elizabeth H. Esty'},
    { id: 'F000010', name: 'Del. Eni F. H. Faleomavaega'},
    { id: 'F000460', name: 'Rep. Blake Farenthold'},
    { id: 'F000030', name: 'Rep. Sam Farr'},
    { id: 'F000043', name: 'Rep. Chaka Fattah'},
    { id: 'F000458', name: 'Rep. Stephen Lee Fincher'},
    { id: 'F000451', name: 'Rep. Michael G. Fitzpatrick'},
    { id: 'F000459', name: 'Rep. Charles "Chuck" J. Fleischmann'},
    { id: 'F000456', name: 'Rep. John Fleming'},
    { id: 'F000461', name: 'Rep. Bill Flores'},
    { id: 'F000445', name: 'Rep. J. Randy Forbes'},
    { id: 'F000449', name: 'Rep. Jeff Lane Fortenberry'},
    { id: 'F000454', name: 'Rep. Bill Foster'},
    { id: 'F000450', name: 'Rep. Virginia Foxx'},
    { id: 'F000462', name: 'Rep. Lois Frankel'},
    { id: 'F000448', name: 'Rep. Trent Franks'},
    { id: 'F000372', name: 'Rep. Rodney P. Frelinghuysen'},
    { id: 'F000455', name: 'Rep. Marcia L. Fudge'},
    { id: 'G000571', name: 'Rep. Tulsi Gabbard'},
    { id: 'G000572', name: 'Rep. Pete P. Gallego'},
    { id: 'G000559', name: 'Rep. John Garamendi'},
    { id: 'G000573', name: 'Rep. Joe Garcia'},
    { id: 'G000562', name: 'Rep. Cory Gardner'},
    { id: 'G000548', name: 'Rep. Scott Garrett'},
    { id: 'G000549', name: 'Rep. Jim Gerlach'},
    { id: 'G000563', name: 'Rep. Bob Gibbs'},
    { id: 'G000564', name: 'Rep. Christopher P. Gibson'},
    { id: 'G000550', name: 'Rep. Phil Gingrey'},
    { id: 'G000552', name: 'Rep. Louie B. Gohmert, Jr.'},
    { id: 'G000289', name: 'Rep. Bob W. Goodlatte'},
    { id: 'G000565', name: 'Rep. Paul A. Gosar'},
    { id: 'G000566', name: 'Rep. Trey Gowdy'},
    { id: 'G000377', name: 'Rep. Kay Granger'},
    { id: 'G000560', name: 'Rep. Tom Graves'},
    { id: 'G000546', name: 'Rep. Sam B. Graves'},
    { id: 'G000556', name: 'Rep. Alan Grayson'},
    { id: 'G000410', name: 'Rep. Gene Eugene Green'},
    { id: 'G000553', name: 'Rep. Al Green'},
    { id: 'G000567', name: 'Rep. Tim Griffin'},
    { id: 'G000568', name: 'Rep. H. Morgan Griffith'},
    { id: 'G000551', name: 'Rep. Raúl M. Grijalva'},
    { id: 'G000569', name: 'Rep. Michael G. Grimm'},
    { id: 'G000558', name: 'Rep. Brett Guthrie'},
    { id: 'G000535', name: 'Rep. Luis V. Gutiérrez'},
    { id: 'H001063', name: 'Rep. Janice Hahn'},
    { id: 'H000067', name: 'Rep. Ralph M. Hall'},
    { id: 'H001050', name: 'Rep. Colleen W. Hanabusa'},
    { id: 'H001051', name: 'Rep. Richard L. Hanna'},
    { id: 'H001045', name: 'Rep. Gregg Harper'},
    { id: 'H001052', name: 'Rep. Andy Harris'},
    { id: 'H001053', name: 'Rep. Vicky Hartzler'},
    { id: 'H000329', name: 'Rep. Doc Hastings'},
    { id: 'H000324', name: 'Rep. Alcee L. Hastings'},
    { id: 'H001055', name: 'Rep. Joseph J. Heck'},
    { id: 'H001064', name: 'Rep. Denny Heck'},
    { id: 'H001036', name: 'Rep. Jeb Hensarling'},
    { id: 'H001056', name: 'Rep. Jaime Herrera Beutler'},
    { id: 'H001038', name: 'Rep. Brian M. Higgins'},
    { id: 'H001047', name: 'Rep. James A. Himes'},
    { id: 'H000636', name: 'Rep. Rubén E. Hinojosa'},
    { id: 'H001065', name: 'Rep. George Holding'},
    { id: 'H001032', name: 'Rep. Rush D. Holt'},
    { id: 'H001034', name: 'Rep. Michael "Mike" M. Honda'},
    { id: 'H001066', name: 'Rep. Steven A. Horsford'},
    { id: 'H000874', name: 'Rep. Steny H. Hoyer'},
    { id: 'H001067', name: 'Rep. Richard Hudson'},
    { id: 'H001057', name: 'Rep. Tim Huelskamp'},
    { id: 'H001068', name: 'Rep. Jared Huffman'},
    { id: 'H001058', name: 'Rep. Bill Huizenga'},
    { id: 'H001059', name: 'Rep. Randy Hultgren'},
    { id: 'H001048', name: 'Rep. Duncan D. Hunter'},
    { id: 'H001060', name: 'Rep. Robert Hurt'},
    { id: 'I000057', name: 'Rep. Steve J. Israel'},
    { id: 'I000056', name: 'Rep. Darrell E. Issa'},
    { id: 'J000032', name: 'Rep. Sheila Jackson Lee'},
    { id: 'J000294', name: 'Rep. Hakeem S. Jeffries'},
    { id: 'J000290', name: 'Rep. Lynn Jenkins'},
    { id: 'J000174', name: 'Rep. Sam Robert Johnson'},
    { id: 'J000288', name: 'Rep. Henry "Hank" C. Johnson, Jr.'},
    { id: 'J000126', name: 'Rep. Eddie Bernice Johnson'},
    { id: 'J000292', name: 'Rep. Bill Johnson'},
    { id: 'J000255', name: 'Rep. Walter B. Jones, Jr.'},
    { id: 'J000289', name: 'Rep. Jim Jordan'},
    { id: 'J000295', name: 'Rep. David P. Joyce'},
    { id: 'K000009', name: 'Rep. Marcy Kaptur'},
    { id: 'K000375', name: 'Rep. William R. Keating'},
    { id: 'K000385', name: 'Rep. Robin Kelly'},
    { id: 'K000376', name: 'Rep. Mike Kelly'},
    { id: 'K000379', name: 'Rep. Joseph P. Kennedy, III'},
    { id: 'K000380', name: 'Rep. Daniel T. Kildee'},
    { id: 'K000381', name: 'Rep. Derek Kilmer'},
    { id: 'K000188', name: 'Rep. Ron James Kind'},
    { id: 'K000362', name: 'Rep. Steve A. King'},
    { id: 'K000210', name: 'Rep. Peter "Pete" T. King'},
    { id: 'K000220', name: 'Rep. Jack Kingston'},
    { id: 'K000378', name: 'Rep. Adam Kinzinger'},
    { id: 'K000368', name: 'Rep. Ann Kirkpatrick'},
    { id: 'K000363', name: 'Rep. John Paul Kline'},
    { id: 'K000382', name: 'Rep. Ann M. Kuster'},
    { id: 'L000578', name: 'Rep. Doug LaMalfa'},
    { id: 'L000573', name: 'Rep. Raúl R. Labrador'},
    { id: 'L000564', name: 'Rep. Doug Lamborn'},
    { id: 'L000567', name: 'Rep. Leonard Lance'},
    { id: 'L000559', name: 'Rep. James "Jim" R. Langevin'},
    { id: 'L000575', name: 'Rep. James Lankford'},
    { id: 'L000560', name: 'Rep. Rick Larsen'},
    { id: 'L000557', name: 'Rep. John B. Larson'},
    { id: 'L000111', name: 'Rep. Tom P. Latham'},
    { id: 'L000566', name: 'Rep. Robert E. Latta'},
    { id: 'L000551', name: 'Rep. Barbara Lee'},
    { id: 'L000263', name: 'Rep. Sander M. Levin'},
    { id: 'L000287', name: 'Rep. John R. Lewis'},
    { id: 'L000563', name: 'Rep. Daniel William Lipinski'},
    { id: 'L000554', name: 'Rep. Frank A. LoBiondo'},
    { id: 'L000565', name: 'Rep. David Loebsack'},
    { id: 'L000397', name: 'Rep. Zoe Lofgren'},
    { id: 'L000576', name: 'Rep. Billy Long'},
    { id: 'L000579', name: 'Rep. Alan S. Lowenthal'},
    { id: 'L000480', name: 'Rep. Nita M. Lowey'},
    { id: 'L000491', name: 'Rep. Frank D. Lucas'},
    { id: 'L000569', name: 'Rep. Blaine Luetkemeyer'},
    { id: 'L000580', name: 'Rep. Michelle Lujan Grisham'},
    { id: 'L000570', name: 'Rep. Ben Ray Luján'},
    { id: 'L000571', name: 'Rep. Cynthia M. Lummis'},
    { id: 'L000562', name: 'Rep. Stephen F. Lynch'},
    { id: 'M001171', name: 'Rep. Daniel B. Maffei'},
    { id: 'M001185', name: 'Rep. Sean Patrick Maloney'},
    { id: 'M000087', name: 'Rep. Carolyn B. Maloney'},
    { id: 'M001158', name: 'Rep. Kenny Ewell Marchant'},
    { id: 'M001179', name: 'Rep. Tom Marino'},
    { id: 'M001184', name: 'Rep. Thomas Massie'},
    { id: 'M001142', name: 'Rep. Jim Matheson'},
    { id: 'M001163', name: 'Rep. Doris O. Matsui'},
    { id: 'M001192', name: 'Rep. Vance McAllister'},
    { id: 'M001165', name: 'Rep. Kevin McCarthy'},
    { id: 'M000309', name: 'Rep. Carolyn McCarthy'},
    { id: 'M001157', name: 'Rep. Michael T. McCaul'},
    { id: 'M001177', name: 'Rep. Tom McClintock'},
    { id: 'M001143', name: 'Rep. Betty Louise McCollum'},
    { id: 'M000404', name: 'Rep. Jim A. McDermott'},
    { id: 'M000312', name: 'Rep. James "Jim" P. McGovern'},
    { id: 'M001156', name: 'Rep. Patrick T. McHenry'},
    { id: 'M000485', name: 'Rep. Mike McIntyre'},
    { id: 'M000508', name: 'Rep. Howard "Buck" P. McKeon'},
    { id: 'M001180', name: 'Rep. David B. McKinley'},
    { id: 'M001159', name: 'Rep. Cathy McMorris Rodgers'},
    { id: 'M001166', name: 'Rep. Jerry McNerney'},
    { id: 'M001187', name: 'Rep. Mark Meadows'},
    { id: 'M001181', name: 'Rep. Patrick Meehan'},
    { id: 'M001137', name: 'Rep. Gregory W. Meeks'},
    { id: 'M001188', name: 'Rep. Grace Meng'},
    { id: 'M001189', name: 'Rep. Luke Messer'},
    { id: 'M000689', name: 'Rep. John L. Mica'},
    { id: 'M001149', name: 'Rep. Michael H. Michaud'},
    { id: 'M001144', name: 'Rep. Jeff Miller'},
    { id: 'M000725', name: 'Rep. George Miller'},
    { id: 'M001139', name: 'Rep. Gary G. Miller'},
    { id: 'M001150', name: 'Rep. Candice S. Miller'},
    { id: 'M001160', name: 'Rep. Gwen Moore'},
    { id: 'M000933', name: 'Rep. James "Jim" P. Moran, Jr.'},
    { id: 'M001190', name: 'Rep. Markwayne Mullin'},
    { id: 'M001182', name: 'Rep. Mick Mulvaney'},
    { id: 'M001151', name: 'Rep. Tim Murphy'},
    { id: 'M001191', name: 'Rep. Patrick Murphy'},
    { id: 'N000002', name: 'Rep. Jerrold L. Nadler'},
    { id: 'N000179', name: 'Rep. Grace F. Napolitano'},
    { id: 'N000015', name: 'Rep. Richard E. Neal'},
    { id: 'N000187', name: 'Rep. Gloria Negrete McLeod'},
    { id: 'N000182', name: 'Rep. Randy Neugebauer'},
    { id: 'N000184', name: 'Rep. Kristi L. Noem'},
    { id: 'N000127', name: 'Rep. Richard M. Nolan'},
    { id: 'N000147', name: 'Del. Eleanor Holmes Norton'},
    { id: 'N000185', name: 'Rep. Richard B. Nugent'},
    { id: 'N000181', name: 'Rep. Devin G. Nunes'},
    { id: 'N000186', name: 'Rep. Alan Nunnelee'},
    { id: 'O000170', name: 'Rep. Beto O\'Rourke'},
    { id: 'O000168', name: 'Rep. Pete Olson'},
    { id: 'O000169', name: 'Rep. William L. Owens'},
    { id: 'P000601', name: 'Rep. Steven M. Palazzo'},
    { id: 'P000034', name: 'Rep. Frank J. Pallone, Jr.'},
    { id: 'P000096', name: 'Rep. Bill J. Pascrell, Jr.'},
    { id: 'P000099', name: 'Rep. Ed Pastor'},
    { id: 'P000594', name: 'Rep. Erik Paulsen'},
    { id: 'P000604', name: 'Rep. Donald M. Payne, Jr.'},
    { id: 'P000588', name: 'Rep. Stevan "Steve" E. Pearce'},
    { id: 'P000197', name: 'Rep. Nancy Pelosi'},
    { id: 'P000593', name: 'Rep. Ed Perlmutter'},
    { id: 'P000605', name: 'Rep. Scott Perry'},
    { id: 'P000608', name: 'Rep. Scott H. Peters'},
    { id: 'P000595', name: 'Rep. Gary C. Peters'},
    { id: 'P000258', name: 'Rep. Collin Clark Peterson'},
    { id: 'P000265', name: 'Rep. Thomas "Tom" E. Petri'},
    { id: 'P000596', name: 'Com. Pedro R. Pierluisi'},
    { id: 'P000597', name: 'Rep. Chellie Pingree'},
    { id: 'P000606', name: 'Rep. Robert Pittenger'},
    { id: 'P000373', name: 'Rep. Joseph R. Pitts'},
    { id: 'P000607', name: 'Rep. Mark Pocan'},
    { id: 'P000592', name: 'Rep. Ted Poe'},
    { id: 'P000598', name: 'Rep. Jared Polis'},
    { id: 'P000602', name: 'Rep. Mike Pompeo'},
    { id: 'P000599', name: 'Rep. Bill Posey'},
    { id: 'P000591', name: 'Rep. Tom Price'},
    { id: 'P000523', name: 'Rep. David E. Price'},
    { id: 'Q000023', name: 'Rep. Mike Quigley'},
    { id: 'R000011', name: 'Rep. Nick J. Rahall, II'},
    { id: 'R000053', name: 'Rep. Charles "Charlie" B. Rangel'},
    { id: 'R000585', name: 'Rep. Tom W. Reed, II'},
    { id: 'R000578', name: 'Rep. David G. Reichert'},
    { id: 'R000586', name: 'Rep. James B. Renacci'},
    { id: 'R000587', name: 'Rep. Reid J. Ribble'},
    { id: 'R000597', name: 'Rep. Tom Rice'},
    { id: 'R000588', name: 'Rep. Cedric L. Richmond'},
    { id: 'R000589', name: 'Rep. E. Scott Rigell'},
    { id: 'R000591', name: 'Rep. Martha Roby'},
    { id: 'R000582', name: 'Rep. David "Phil" P. Roe'},
    { id: 'R000575', name: 'Rep. Mike Rogers'},
    { id: 'R000572', name: 'Rep. Mike Rogers'},
    { id: 'R000395', name: 'Rep. Harold "Hal" Rogers'},
    { id: 'R000409', name: 'Rep. Dana T. Rohrabacher'},
    { id: 'R000592', name: 'Rep. Todd Rokita'},
    { id: 'R000583', name: 'Rep. Thomas J. Rooney'},
    { id: 'R000435', name: 'Rep. Ileana Ros-Lehtinen'},
    { id: 'R000580', name: 'Rep. Peter J. Roskam'},
    { id: 'R000593', name: 'Rep. Dennis A. Ross'},
    { id: 'R000598', name: 'Rep. Keith J. Rothfus'},
    { id: 'R000486', name: 'Rep. Lucille Roybal-Allard'},
    { id: 'R000487', name: 'Rep. Edward "Ed" R. Royce'},
    { id: 'R000599', name: 'Rep. Raul Ruiz'},
    { id: 'R000594', name: 'Rep. Jon Runyan'},
    { id: 'R000576', name: 'Rep. C. A. Dutch Ruppersberger'},
    { id: 'R000515', name: 'Rep. Bobby L. Rush'},
    { id: 'R000577', name: 'Rep. Tim J. Ryan'},
    { id: 'R000570', name: 'Rep. Paul D. Ryan'},
    { id: 'S001177', name: 'Del. Gregorio Kilili Camacho Sablan'},
    { id: 'S000018', name: 'Rep. Matt Salmon'},
    { id: 'S000030', name: 'Rep. Loretta B. Sanchez'},
    { id: 'S000051', name: 'Rep. Marshall "Mark" Sanford'},
    { id: 'S001168', name: 'Rep. John P. Sarbanes'},
    { id: 'S001176', name: 'Rep. Steve Joseph Scalise'},
    { id: 'S001145', name: 'Rep. Janice "Jan" D. Schakowsky'},
    { id: 'S001150', name: 'Rep. Adam B. Schiff'},
    { id: 'S001190', name: 'Rep. Bradley S. Schneider'},
    { id: 'S001179', name: 'Rep. Aaron Schock'},
    { id: 'S001180', name: 'Rep. Kurt Schrader'},
    { id: 'S001162', name: 'Rep. Allyson Y. Schwartz'},
    { id: 'S001183', name: 'Rep. David Schweikert'},
    { id: 'S000185', name: 'Rep. Robert "Bobby" C. Scott'},
    { id: 'S001157', name: 'Rep. David Scott'},
    { id: 'S001189', name: 'Rep. Austin Scott'},
    { id: 'S000244', name: 'Rep. F. James Sensenbrenner, Jr.'},
    { id: 'S000248', name: 'Rep. José E. Serrano'},
    { id: 'S000250', name: 'Rep. Pete A. Sessions'},
    { id: 'S001185', name: 'Rep. Terri A. Sewell'},
    { id: 'S001170', name: 'Rep. Carol Shea-Porter'},
    { id: 'S000344', name: 'Rep. Brad J. Sherman'},
    { id: 'S000364', name: 'Rep. John M. Shimkus'},
    { id: 'S001154', name: 'Rep. Bill Shuster'},
    { id: 'S001148', name: 'Rep. Michael "Mike" K. Simpson'},
    { id: 'S001191', name: 'Rep. Kyrsten Sinema'},
    { id: 'S001165', name: 'Rep. Albio Sires'},
    { id: 'S000480', name: 'Rep. Louise McIntosh Slaughter'},
    { id: 'S000583', name: 'Rep. Lamar S. Smith'},
    { id: 'S001195', name: 'Rep. Jason T. Smith'},
    { id: 'S000522', name: 'Rep. Christopher "Chris" H. Smith'},
    { id: 'S001172', name: 'Rep. Adrian Smith'},
    { id: 'S000510', name: 'Rep. Adam Smith'},
    { id: 'S001186', name: 'Rep. Steve Southerland'},
    { id: 'S001175', name: 'Rep. Jackie Speier'},
    { id: 'S001192', name: 'Rep. Chris Stewart'},
    { id: 'S001187', name: 'Rep. Steve Stivers'},
    { id: 'S000937', name: 'Rep. Steve Stockman'},
    { id: 'S001188', name: 'Rep. Marlin A. Stutzman'},
    { id: 'S001193', name: 'Rep. Eric Swalwell'},
    { id: 'S001156', name: 'Rep. Linda T. Sánchez'},
    { id: 'T000472', name: 'Rep. Mark Takano'},
    { id: 'T000459', name: 'Rep. Lee R. Terry'},
    { id: 'T000460', name: 'Rep. Mike Michael Thompson'},
    { id: 'T000467', name: 'Rep. Glenn Thompson'},
    { id: 'T000193', name: 'Rep. Bennie G. Thompson'},
    { id: 'T000238', name: 'Rep. Mac M. Thornberry'},
    { id: 'T000462', name: 'Rep. Patrick "Pat" J. Tiberi'},
    { id: 'T000266', name: 'Rep. John F. Tierney'},
    { id: 'T000470', name: 'Rep. Scott R. Tipton'},
    { id: 'T000468', name: 'Rep. Dina Titus'},
    { id: 'T000469', name: 'Rep. Paul Tonko'},
    { id: 'T000465', name: 'Rep. Niki S. Tsongas'},
    { id: 'T000463', name: 'Rep. Michael R. Turner'},
    { id: 'U000031', name: 'Rep. Fred Stephen Upton'},
    { id: 'V000129', name: 'Rep. David G. Valadao'},
    { id: 'V000128', name: 'Rep. Chris Van Hollen, Jr.'},
    { id: 'V000130', name: 'Rep. Juan Vargas'},
    { id: 'V000131', name: 'Rep. Marc A. Veasey'},
    { id: 'V000132', name: 'Rep. Filemon Vela'},
    { id: 'V000081', name: 'Rep. Nydia M. Velázquez'},
    { id: 'V000108', name: 'Rep. Peter J. Visclosky'},
    { id: 'W000812', name: 'Rep. Ann Wagner'},
    { id: 'W000798', name: 'Rep. Tim Walberg'},
    { id: 'W000791', name: 'Rep. Greg P. Walden'},
    { id: 'W000813', name: 'Rep. Jackie Walorski'},
    { id: 'W000799', name: 'Rep. Timothy James Walz'},
    { id: 'W000797', name: 'Rep. Debbie Wasserman Schultz'},
    { id: 'W000187', name: 'Rep. Maxine Waters'},
    { id: 'W000215', name: 'Rep. Henry A. Waxman'},
    { id: 'W000814', name: 'Rep. Randy K. Weber'},
    { id: 'W000806', name: 'Rep. Daniel Webster'},
    { id: 'W000800', name: 'Rep. Peter Welch'},
    { id: 'W000815', name: 'Rep. Brad R. Wenstrup'},
    { id: 'W000796', name: 'Rep. Lynn A. Westmoreland'},
    { id: 'W000413', name: 'Rep. Ed Whitfield'},
    { id: 'W000816', name: 'Rep. Roger Williams'},
    { id: 'W000795', name: 'Rep. Joe G. Wilson'},
    { id: 'W000808', name: 'Rep. Frederica S. Wilson'},
    { id: 'W000804', name: 'Rep. Robert J. Wittman'},
    { id: 'W000672', name: 'Rep. Frank R. Wolf'},
    { id: 'W000809', name: 'Rep. Steve Womack'},
    { id: 'W000810', name: 'Rep. Rob Woodall'},
    { id: 'Y000062', name: 'Rep. John A. Yarmuth'},
    { id: 'Y000063', name: 'Rep. Kevin Yoder'},
    { id: 'Y000065', name: 'Rep. Ted S. Yoho'},
    { id: 'Y000064', name: 'Rep. Todd C. Young'},
    { id: 'Y000033', name: 'Rep. Don E. Young'}
  ];

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    startup: function() {
      this.inherited(arguments);

      this._setupControls();

      this._subscribeTopics();
    },

    _subscribeTopics: function() {

      var anim = null;
      var animHandle = null;

      // topic.subscribe("/loc/search/hide", lang.hitch(this, function() {
      //   if (anim !== null) {
      //     anim.stop();
      //     animHandle.remove();
      //     anim = null;
      //     animHandle = null;
      //   }

      //   // this.searchPlaceholderNode
      //   // this.searchAreaNode

      //   anim = fx2.combine([
      //     // fx2.wipeOut({ node: this.searchAreaNode, duration: 300 }),
      //     // fx2.wipeIn({ node: this.searchPlaceholderNode, duration: 300 })
      //   ]);
      //   // on(anim, "end", function() {
      //   //   if (animHandle !== null) {
      //   //     animHandle.remove();
      //   //   }
      //   //   animHandle = null;
      //   // });
      //   anim.play();

      // }));

      // topic.subscribe("/loc/search/show", lang.hitch(this, function() {
      //   if (anim !== null) {
      //     anim.stop();
      //     animHandle.remove();
      //     anim = null;
      //     animHandle = null;
      //   }

      //   anim = fx2.combine([

      //   ]);
      //   // on(anim, "end", function() {
      //   //   if (animHandle !== null) {
      //   //     animHandle.remove();
      //   //   }
      //   //   animHandle = null;
      //   // });
      //   anim.play();
      // }));

    },

    _setupControls: function() {

      // zip
      $(this.zipInput).keypress(lang.hitch(this, function (e) {
        if (e.which == 13) {
          this._doZIPSearch();
          $(this.zipInput).val("");
          return false;
        }
      }));

      // state 
      $(this.stateSelect).selectpicker();
      $(this.stateSelect).on("change", lang.hitch(this, this._doStateSearch));

      // name
      $(this.nameInput).typeahead({
        source: MEMBERS_FIXTURES,
        itemSelected: lang.hitch(this, function(fn, id, name) {
          topic.publish("/loc/search/members/id", {
            memberId: id
          });
          $(this.nameInput).val("");
        })
      });
      $(this.nameInput).keypress(lang.hitch(this, function (e) {
        if (e.which == 13) {
          this._doNameSearch();
          return false;
        }
      }));

      // committee
      $(this.committeeSelect).selectpicker();
      $(this.committeeSelect).on("change", lang.hitch(this, this._doCommitteeSearch));
    },

    _doZIPSearch: function(e) {
topic.publish("/loc/search/hide", {});
      var value = $(this.zipInput).val() || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/members/zip", {
        zip: value
      });

    },

    _doStateSearch: function(e) {

      var value = $(this.stateSelect).selectpicker("val") || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/members/state", {
        state: value
      });

      $(this.stateSelect).selectpicker("val", "-");

    },

    _doGeolocationSearch: function() {

      this._getGeolocation().then(function(location) {

        var point = new Point(location.coords.longitude, location.coords.latitude, new SpatialReference(4326));

        console.group("Geolocation Success");
        console.log(point);
        console.groupEnd("Geolocation Success");

        topic.publish("/loc/search/members/geometry", {
          geometry: point
        });

      }, function(error) {

        console.group("Geolocation Error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("PERMISSION_DENIED");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("POSITION_UNAVAILABLE");
            break;
          case error.TIMEOUT:
            console.log("TIMEOUT");
            break;
          default:
            console.log("UNKNOWN");
            break;
        }
        console.groupEnd("Geolocation Error");

      });

    },

    _getGeolocation: function() {
      
      var d = new Deferred();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(d.resolve, d.reject);
      } else {
        d.reject();
      }

      return d;
    },

    _doNameSearch: function(e) {

      var value = $(this.nameInput).val() || null;
      if (value === null || name.length === 0) {
        return;
      }

      topic.publish("/loc/search/members/name", {
        name: value
      });

    },

    _doCommitteeSearch: function(e) {

      var value = $(this.committeeSelect).selectpicker("val") || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/committees/id", {
        committeeId: value
      });

      $(this.committeeSelect).selectpicker("val", "-");

    }

  });

});
