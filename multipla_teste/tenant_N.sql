--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: multipla
--

INSERT INTO public.django_content_type (id, app_label, model) VALUES (1, 'admin', 'logentry');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (2, 'auth', 'permission');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (3, 'auth', 'group');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (4, 'auth', 'user');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (6, 'sessions', 'session');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (7, 'authtoken', 'token');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (8, 'authtoken', 'tokenproxy');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (9, 'fornecedores', 'fornecedor');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (10, 'clientes', 'cliente');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (11, 'contratos', 'contrato');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (12, 'contratos', 'projecaofaturamento');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (13, 'contratos', 'contratoprojeto');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (14, 'projetos', 'projeto');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (15, 'pagamentos', 'formapagamento');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (16, 'contas_pagar', 'contaapagar');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (17, 'contas_pagar', 'contaareceber');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (18, 'contas_pagar', 'contapagaravulso');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (19, 'contas_pagar', 'contareceberavulso');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (20, 'contas_pagar', 'projetoconta');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (21, 'contas_pagar', 'projetocontapagar');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (22, 'usuarios', 'perfilusuario');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (23, 'empresas', 'empresa');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (24, 'empresas', 'filial');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (25, 'financeiro', 'centrocusto');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (26, 'financeiro', 'contafinanceira');
INSERT INTO public.django_content_type (id, app_label, model) VALUES (27, 'funcionarios', 'funcionario');


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: multipla
--

INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (1, 'Can add log entry', 1, 'add_logentry');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (2, 'Can change log entry', 1, 'change_logentry');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (3, 'Can delete log entry', 1, 'delete_logentry');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (4, 'Can view log entry', 1, 'view_logentry');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (5, 'Can add permission', 2, 'add_permission');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (6, 'Can change permission', 2, 'change_permission');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (7, 'Can delete permission', 2, 'delete_permission');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (8, 'Can view permission', 2, 'view_permission');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (9, 'Can add group', 3, 'add_group');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (10, 'Can change group', 3, 'change_group');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (11, 'Can delete group', 3, 'delete_group');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (12, 'Can view group', 3, 'view_group');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (13, 'Can add user', 4, 'add_user');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (14, 'Can change user', 4, 'change_user');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (15, 'Can delete user', 4, 'delete_user');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (16, 'Can view user', 4, 'view_user');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (17, 'Can add content type', 5, 'add_contenttype');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (18, 'Can change content type', 5, 'change_contenttype');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (19, 'Can delete content type', 5, 'delete_contenttype');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (20, 'Can view content type', 5, 'view_contenttype');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (21, 'Can add session', 6, 'add_session');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (22, 'Can change session', 6, 'change_session');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (23, 'Can delete session', 6, 'delete_session');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (24, 'Can view session', 6, 'view_session');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (25, 'Can add Token', 7, 'add_token');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (26, 'Can change Token', 7, 'change_token');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (27, 'Can delete Token', 7, 'delete_token');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (28, 'Can view Token', 7, 'view_token');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (29, 'Can add Token', 8, 'add_tokenproxy');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (30, 'Can change Token', 8, 'change_tokenproxy');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (31, 'Can delete Token', 8, 'delete_tokenproxy');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (32, 'Can view Token', 8, 'view_tokenproxy');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (33, 'Can add fornecedor', 9, 'add_fornecedor');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (34, 'Can change fornecedor', 9, 'change_fornecedor');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (35, 'Can delete fornecedor', 9, 'delete_fornecedor');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (36, 'Can view fornecedor', 9, 'view_fornecedor');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (37, 'Can add cliente', 10, 'add_cliente');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (38, 'Can change cliente', 10, 'change_cliente');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (39, 'Can delete cliente', 10, 'delete_cliente');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (40, 'Can view cliente', 10, 'view_cliente');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (41, 'Can add contrato', 11, 'add_contrato');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (42, 'Can change contrato', 11, 'change_contrato');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (43, 'Can delete contrato', 11, 'delete_contrato');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (44, 'Can view contrato', 11, 'view_contrato');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (45, 'Can add projecao faturamento', 12, 'add_projecaofaturamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (46, 'Can change projecao faturamento', 12, 'change_projecaofaturamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (47, 'Can delete projecao faturamento', 12, 'delete_projecaofaturamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (48, 'Can view projecao faturamento', 12, 'view_projecaofaturamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (49, 'Can add contrato projeto', 13, 'add_contratoprojeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (50, 'Can change contrato projeto', 13, 'change_contratoprojeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (51, 'Can delete contrato projeto', 13, 'delete_contratoprojeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (52, 'Can view contrato projeto', 13, 'view_contratoprojeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (53, 'Can add projeto', 14, 'add_projeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (54, 'Can change projeto', 14, 'change_projeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (55, 'Can delete projeto', 14, 'delete_projeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (56, 'Can view projeto', 14, 'view_projeto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (57, 'Can add forma pagamento', 15, 'add_formapagamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (58, 'Can change forma pagamento', 15, 'change_formapagamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (59, 'Can delete forma pagamento', 15, 'delete_formapagamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (60, 'Can view forma pagamento', 15, 'view_formapagamento');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (61, 'Can add conta a pagar', 16, 'add_contaapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (62, 'Can change conta a pagar', 16, 'change_contaapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (63, 'Can delete conta a pagar', 16, 'delete_contaapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (64, 'Can view conta a pagar', 16, 'view_contaapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (65, 'Can add conta a receber', 17, 'add_contaareceber');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (66, 'Can change conta a receber', 17, 'change_contaareceber');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (67, 'Can delete conta a receber', 17, 'delete_contaareceber');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (68, 'Can view conta a receber', 17, 'view_contaareceber');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (69, 'Can add conta pagar avulso', 18, 'add_contapagaravulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (70, 'Can change conta pagar avulso', 18, 'change_contapagaravulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (71, 'Can delete conta pagar avulso', 18, 'delete_contapagaravulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (72, 'Can view conta pagar avulso', 18, 'view_contapagaravulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (73, 'Can add conta receber avulso', 19, 'add_contareceberavulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (74, 'Can change conta receber avulso', 19, 'change_contareceberavulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (75, 'Can delete conta receber avulso', 19, 'delete_contareceberavulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (76, 'Can view conta receber avulso', 19, 'view_contareceberavulso');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (77, 'Can add projeto conta', 20, 'add_projetoconta');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (78, 'Can change projeto conta', 20, 'change_projetoconta');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (79, 'Can delete projeto conta', 20, 'delete_projetoconta');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (80, 'Can view projeto conta', 20, 'view_projetoconta');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (81, 'Can add projeto conta pagar', 21, 'add_projetocontapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (82, 'Can change projeto conta pagar', 21, 'change_projetocontapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (83, 'Can delete projeto conta pagar', 21, 'delete_projetocontapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (84, 'Can view projeto conta pagar', 21, 'view_projetocontapagar');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (85, 'Can add perfil usuario', 22, 'add_perfilusuario');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (86, 'Can change perfil usuario', 22, 'change_perfilusuario');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (87, 'Can delete perfil usuario', 22, 'delete_perfilusuario');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (88, 'Can view perfil usuario', 22, 'view_perfilusuario');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (89, 'Can add empresa', 23, 'add_empresa');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (90, 'Can change empresa', 23, 'change_empresa');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (91, 'Can delete empresa', 23, 'delete_empresa');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (92, 'Can view empresa', 23, 'view_empresa');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (93, 'Can add filial', 24, 'add_filial');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (94, 'Can change filial', 24, 'change_filial');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (95, 'Can delete filial', 24, 'delete_filial');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (96, 'Can view filial', 24, 'view_filial');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (97, 'Can add centro custo', 25, 'add_centrocusto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (98, 'Can change centro custo', 25, 'change_centrocusto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (99, 'Can delete centro custo', 25, 'delete_centrocusto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (100, 'Can view centro custo', 25, 'view_centrocusto');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (101, 'Can add conta financeira', 26, 'add_contafinanceira');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (102, 'Can change conta financeira', 26, 'change_contafinanceira');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (103, 'Can delete conta financeira', 26, 'delete_contafinanceira');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (104, 'Can view conta financeira', 26, 'view_contafinanceira');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (105, 'Can add funcionario', 27, 'add_funcionario');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (106, 'Can change funcionario', 27, 'change_funcionario');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (107, 'Can delete funcionario', 27, 'delete_funcionario');
INSERT INTO public.auth_permission (id, name, content_type_id, codename) VALUES (108, 'Can view funcionario', 27, 'view_funcionario');


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: empresas_empresa; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: empresas_filial; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: clientes_cliente; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: fornecedores_fornecedor; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: funcionarios_funcionario; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contratos_contrato; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: financeiro_centrocusto; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: financeiro_contafinanceira; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: pagamentos_formapagamento; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_contaapagar; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_contaareceber; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_contapagaravulso; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: projetos_projeto; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_contapagaravulso_projetos; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_contareceberavulso; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_contareceberavulso_projetos; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_projetoconta; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contas_pagar_projetocontapagar; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contratos_contratoprojeto; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: contratos_projecaofaturamento; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: multipla
--

INSERT INTO public.django_migrations (id, app, name, applied) VALUES (1, 'contenttypes', '0001_initial', '2025-04-30 20:37:41.146187+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (2, 'auth', '0001_initial', '2025-04-30 20:37:41.172814+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (3, 'admin', '0001_initial', '2025-04-30 20:37:41.183735+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (4, 'admin', '0002_logentry_remove_auto_add', '2025-04-30 20:37:41.190043+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (5, 'admin', '0003_logentry_add_action_flag_choices', '2025-04-30 20:37:41.194938+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (6, 'contenttypes', '0002_remove_content_type_name', '2025-04-30 20:37:41.205662+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (7, 'auth', '0002_alter_permission_name_max_length', '2025-04-30 20:37:41.211103+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (8, 'auth', '0003_alter_user_email_max_length', '2025-04-30 20:37:41.216696+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (9, 'auth', '0004_alter_user_username_opts', '2025-04-30 20:37:41.221924+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (10, 'auth', '0005_alter_user_last_login_null', '2025-04-30 20:37:41.227691+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (11, 'auth', '0006_require_contenttypes_0002', '2025-04-30 20:37:41.228746+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (12, 'auth', '0007_alter_validators_add_error_messages', '2025-04-30 20:37:41.234108+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (13, 'auth', '0008_alter_user_username_max_length', '2025-04-30 20:37:41.24147+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (14, 'auth', '0009_alter_user_last_name_max_length', '2025-04-30 20:37:41.246599+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (15, 'auth', '0010_alter_group_name_max_length', '2025-04-30 20:37:41.252422+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (16, 'auth', '0011_update_proxy_permissions', '2025-04-30 20:37:41.256755+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (17, 'auth', '0012_alter_user_first_name_max_length', '2025-04-30 20:37:41.262221+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (18, 'authtoken', '0001_initial', '2025-04-30 20:37:41.27041+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (19, 'authtoken', '0002_auto_20160226_1747', '2025-04-30 20:37:41.288106+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (20, 'authtoken', '0003_tokenproxy', '2025-04-30 20:37:41.289911+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (21, 'authtoken', '0004_alter_tokenproxy_options', '2025-04-30 20:37:41.292792+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (22, 'clientes', '0001_initial', '2025-04-30 20:37:41.2992+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (23, 'projetos', '0001_initial', '2025-04-30 20:37:41.30209+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (24, 'pagamentos', '0001_initial', '2025-04-30 20:37:41.304936+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (25, 'funcionarios', '0001_initial', '2025-04-30 20:37:41.312151+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (26, 'fornecedores', '0001_initial', '2025-04-30 20:37:41.317201+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (27, 'financeiro', '0001_initial', '2025-04-30 20:37:41.324311+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (28, 'contratos', '0001_initial', '2025-04-30 20:37:41.350032+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (29, 'contas_pagar', '0001_initial', '2025-04-30 20:37:41.440114+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (30, 'contratos', '0002_contrato_horizonte_projecao', '2025-04-30 20:37:41.486585+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (31, 'empresas', '0001_initial', '2025-04-30 20:37:41.496972+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (32, 'projetos', '0002_alter_projeto_data_termino', '2025-04-30 20:37:41.508099+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (33, 'sessions', '0001_initial', '2025-04-30 20:37:41.512389+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (34, 'usuarios', '0001_initial', '2025-04-30 20:37:41.524589+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (35, 'clientes', '0002_cliente_filial', '2025-05-12 12:55:17.806649+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (36, 'contas_pagar', '0002_contaapagar_filial_contaareceber_filial_and_more', '2025-05-12 12:55:17.876359+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (37, 'contratos', '0003_contrato_filial', '2025-05-12 12:55:17.895707+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (38, 'fornecedores', '0002_fornecedor_filial', '2025-05-12 12:55:17.91403+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (39, 'clientes', '0003_populate_filial', '2025-05-12 13:10:06.953036+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (40, 'clientes', '0004_alter_cliente_filial', '2025-05-12 13:33:07.21007+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (41, 'fornecedores', '0003_populate_filial', '2025-05-12 14:41:54.658501+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (42, 'fornecedores', '0004_alter_fornecedor_filial', '2025-05-12 14:45:26.497885+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (43, 'contratos', '0004_populate_filial', '2025-05-12 14:51:47.14896+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (44, 'contratos', '0005_alter_contrato_filial', '2025-05-12 14:52:11.418009+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (45, 'contas_pagar', '0003_populate_filial', '2025-05-12 14:57:02.592109+00');
INSERT INTO public.django_migrations (id, app, name, applied) VALUES (46, 'contas_pagar', '0004_alter_contaapagar_filial_alter_contaareceber_filial_and_more', '2025-05-12 14:57:02.880448+00');


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Data for Name: usuarios_perfilusuario; Type: TABLE DATA; Schema: public; Owner: multipla
--



--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 108, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: clientes_cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.clientes_cliente_id_seq', 1, false);


--
-- Name: contas_pagar_contaapagar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_contaapagar_id_seq', 1, false);


--
-- Name: contas_pagar_contaareceber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_contaareceber_id_seq', 1, false);


--
-- Name: contas_pagar_contapagaravulso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_contapagaravulso_id_seq', 1, false);


--
-- Name: contas_pagar_contapagaravulso_projetos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_contapagaravulso_projetos_id_seq', 1, false);


--
-- Name: contas_pagar_contareceberavulso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_contareceberavulso_id_seq', 1, false);


--
-- Name: contas_pagar_contareceberavulso_projetos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_contareceberavulso_projetos_id_seq', 1, false);


--
-- Name: contas_pagar_projetoconta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_projetoconta_id_seq', 1, false);


--
-- Name: contas_pagar_projetocontapagar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contas_pagar_projetocontapagar_id_seq', 1, false);


--
-- Name: contratos_contrato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contratos_contrato_id_seq', 1, false);


--
-- Name: contratos_contratoprojeto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contratos_contratoprojeto_id_seq', 1, false);


--
-- Name: contratos_projecaofaturamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.contratos_projecaofaturamento_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 27, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 46, true);


--
-- Name: empresas_empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.empresas_empresa_id_seq', 1, false);


--
-- Name: empresas_filial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.empresas_filial_id_seq', 1, false);


--
-- Name: financeiro_centrocusto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.financeiro_centrocusto_id_seq', 1, false);


--
-- Name: financeiro_contafinanceira_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.financeiro_contafinanceira_id_seq', 1, false);


--
-- Name: fornecedores_fornecedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.fornecedores_fornecedor_id_seq', 1, false);


--
-- Name: funcionarios_funcionario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.funcionarios_funcionario_id_seq', 1, false);


--
-- Name: pagamentos_formapagamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.pagamentos_formapagamento_id_seq', 1, false);


--
-- Name: projetos_projeto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.projetos_projeto_id_seq', 1, false);


--
-- Name: usuarios_perfilusuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: multipla
--

SELECT pg_catalog.setval('public.usuarios_perfilusuario_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

